import _ from 'lodash'
import {
  DashboardTemplate,
  TemplateType,
  DashboardTemplateIncluded,
  LabelIncluded,
  CellIncluded,
  CellRelationship,
  VariableIncluded,
} from 'src/types/v2'
import {IDashboard, ILabel, Cell, Variable} from '@influxdata/influx'
import {client} from 'src/utils/api'

// createdashboardTemplates

export const createDashboardFromTemplate = async (
  template: DashboardTemplate,
  orgID: string
): Promise<IDashboard> => {
  const {content} = template

  if (
    content.data.type !== TemplateType.Dashboard ||
    template.meta.version !== '1'
  ) {
    throw new Error('Can not create dashboard from this template')
  }

  const {name, description} = content.data.attributes

  const createdDashboard = await client.dashboards.create({
    orgID,
    name,
    description,
  })

  if (!createdDashboard || !createdDashboard.id) {
    throw new Error('Failed to create dashboard')
  }

  await Promise.all([
    await createLabelsFromTemplate(template, createdDashboard),
    await createCellsFromTemplate(template, createdDashboard),
  ])
  createVariablesFromTemplate(template, orgID)

  const dashboard = await client.dashboards.get(createdDashboard.id)
  return dashboard
}

const createLabelsFromTemplate = async (
  template: DashboardTemplate,
  dashboard: IDashboard
) => {
  const {
    content: {included},
  } = template

  if (!included || !included.length) {
    return
  }

  const labelsIncluded = findIncludedLabels(included)

  const existingLabels = await client.labels.getAll()

  const labelsToCreate = findLabelsToCreate(existingLabels, labelsIncluded).map(
    l => ({
      name: _.get(l, 'attributes.name', ''),
      properties: _.get(l, 'attributes.properties', {}),
      orgID: dashboard.orgID,
    })
  )

  const createdLabels = await client.labels.createAll(labelsToCreate)

  // IDs of newly created labels that should be added to dashboard
  const createdLabelIDs = createdLabels.map(l => l.id || '')

  // IDs of existing labels that should be added to dashboard
  const existingLabelIDsToAdd = findLabelIDsToAdd(
    existingLabels,
    labelsIncluded
  )

  await client.dashboards.addLabels(dashboard.id, [
    ...createdLabelIDs,
    ...existingLabelIDsToAdd,
  ])
}

const findIncludedLabels = (resources: DashboardTemplateIncluded[]) => {
  return resources.filter(
    (r): r is LabelIncluded => r.type === TemplateType.Label
  )
}

const findLabelIDsToAdd = (
  existingLabels: ILabel[],
  incomingLabels: LabelIncluded[]
): string[] => {
  return existingLabels
    .filter(el => !!incomingLabels.find(l => el.name === l.attributes.name))
    .map(l => l.id || '')
}

const findLabelsToCreate = (
  currentLabels: ILabel[],
  labels: LabelIncluded[]
): LabelIncluded[] => {
  return labels.filter(
    l => !currentLabels.find(el => el.name === l.attributes.name)
  )
}

const createCellsFromTemplate = async (
  template: DashboardTemplate,
  createdDashboard: IDashboard
) => {
  const {content} = template

  if (
    !content.data.relationships ||
    !content.data.relationships[TemplateType.Cell]
  ) {
    return
  }

  const cellRelationships = content.data.relationships[TemplateType.Cell].data

  const cellsToCreate = findToCreateFromIncluded(
    content.included,
    cellRelationships
  )

  const pendingCells = cellsToCreate.map(c => {
    const {
      attributes: {x, y, w, h},
    } = c
    return client.dashboards.createCell(createdDashboard.id, {x, y, w, h})
  })

  const cellResponses = await Promise.all(pendingCells)

  createViewsFromTemplate(
    template,
    cellResponses,
    cellsToCreate,
    createdDashboard
  )
}

const findToCreateFromIncluded = (
  includedResources: DashboardTemplateIncluded[],
  cellRelationships: CellRelationship[]
): CellIncluded[] => {
  return includedResources.reduce(
    (acc, ir) => {
      if (ir.type === TemplateType.Cell) {
        const found = cellRelationships.some(
          cr => cr.type === TemplateType.Cell && cr.id === ir.id
        )
        if (found) {
          acc = [...acc, ir]
        }
      }
      return acc
    },
    [] as CellIncluded[]
  )
}

const createViewsFromTemplate = async (
  template: DashboardTemplate,
  createdCells: Cell[],
  originalCellsIncluded: CellIncluded[],
  createdDashboard: IDashboard
) => {
  const pendingViews = createdCells.map((c, i) => {
    const cellFromTemplate = originalCellsIncluded[i]
    const viewRelationship =
      cellFromTemplate.relationships[TemplateType.View].data

    const includedView = template.content.included.find(ir => {
      return ir.type === TemplateType.View && ir.id === viewRelationship.id
    })

    if (includedView) {
      return client.dashboards.updateView(
        createdDashboard.id,
        c.id || '',
        includedView.attributes
      )
    }
  })

  await Promise.all(pendingViews)
}

const createVariablesFromTemplate = async (
  template: DashboardTemplate,
  orgID
) => {
  const {content} = template
  if (
    !content.data.relationships ||
    !content.data.relationships[TemplateType.Variable]
  ) {
    return
  }
  const variablesIncluded = findIncludedVariables(content.included)

  const existingVariables = await client.variables.getAll()

  const variablesToCreate = findVariablesToCreate(
    existingVariables,
    variablesIncluded
  ).map(v => ({...v.attributes, orgID}))

  await client.variables.createAll(variablesToCreate)
}

const findIncludedVariables = (resources: DashboardTemplateIncluded[]) => {
  return resources.filter(
    (r): r is VariableIncluded => r.type === TemplateType.Variable
  )
}
const findVariablesToCreate = (
  existingVariables: Variable[],
  incomingVariables: VariableIncluded[]
): VariableIncluded[] => {
  return incomingVariables.filter(
    v => !existingVariables.find(ev => ev.name === v.attributes.name)
  )
}
