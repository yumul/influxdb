// Libraries
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {isEmpty} from 'lodash'
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

// Components
// import VariableDropdown from 'src/dashboards/components/variablesControlBar/VariableDropdown'
import {EmptyState, ComponentSize} from 'src/clockface'
import {TechnoSpinner} from '@influxdata/clockface'

// Utils
import {
  getVariablesForDashboard,
  getDashboardValuesStatus,
} from 'src/variables/selectors'

// Styles
import 'src/dashboards/components/variablesControlBar/VariablesControlBar.scss'

// Actions
import {moveVariable} from 'src/variables/actions'

// Types
import {AppState} from 'src/types/v2'
import {Variable} from '@influxdata/influx'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'
import {RemoteDataState} from 'src/types'
import DraggableDropdown from 'src/dashboards/components/variablesControlBar/DraggableDropdown'

interface OwnProps {
  dashboardID: string
}

interface StateProps {
  variables: Variable[]
  valuesStatus: RemoteDataState
}

interface DispatchProps {
  moveVariable: typeof moveVariable
}

type Props = StateProps & DispatchProps & OwnProps

@ErrorHandling
class VariablesControlBar extends PureComponent<Props> {
  render() {
    const {dashboardID, variables, valuesStatus} = this.props

    if (isEmpty(variables)) {
      return (
        <div className="variables-control-bar">
          <EmptyState
            size={ComponentSize.ExtraSmall}
            customClass="variables-control-bar--empty"
          >
            <EmptyState.Text text="To see variable controls here, use a variable in a cell query" />
          </EmptyState>
        </div>
      )
    }

    return (
      <div className="variables-control-bar">
        {variables.map((v, i) => (
          <DraggableDropdown
            key={v.id}
            name={v.name}
            id={v.id}
            index={i}
            dashboardID={dashboardID}
            moveDropdown={this.handleMoveDropdown}
          />
        ))}
        {valuesStatus === RemoteDataState.Loading && (
          <TechnoSpinner diameterPixels={18} />
        )}
      </div>
    )
  }

  private handleMoveDropdown = (
    originalIndex: number,
    newIndex: number
  ): void => {
    const {dashboardID, moveVariable} = this.props
    moveVariable(originalIndex, newIndex, dashboardID)
  }
}

const mdtp = {
  moveVariable,
}

const mstp = (state: AppState, props: OwnProps): StateProps => {
  const variables = getVariablesForDashboard(state, props.dashboardID)
  const valuesStatus = getDashboardValuesStatus(state, props.dashboardID)

  return {variables, valuesStatus}
}

export default DragDropContext(HTML5Backend)(
  connect<StateProps, DispatchProps, OwnProps>(
    mstp,
    mdtp
  )(VariablesControlBar)
)
