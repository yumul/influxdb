// Libraries
import React, {Component, ChangeEvent} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

// Components
import LabelOverlayForm from 'src/configuration/components/LabelOverlayForm'
import {Overlay, ComponentStatus} from 'src/clockface'

// Types
import {ILabel} from '@influxdata/influx'

// Constants
import {EMPTY_LABEL} from 'src/configuration/constants/LabelColors'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'
import {AppState} from 'src/types/v2'

interface OwnProps {
  isVisible: boolean
  onDismiss: () => void
  onCreateLabel: (label: ILabel) => void
  onNameValidation: (name: string) => string | null
  overrideDefaultName?: string
}

interface StateProps {
  orgID: string
}

type Props = OwnProps & StateProps

interface State {
  label: ILabel
  colorStatus: ComponentStatus
}

@ErrorHandling
class CreateLabelOverlay extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      label: {...EMPTY_LABEL, name: this.props.overrideDefaultName},
      colorStatus: ComponentStatus.Default,
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.overrideDefaultName !== this.props.overrideDefaultName &&
      this.props.isVisible === false
    ) {
      const name = this.props.overrideDefaultName
      const label = {...this.state.label, name}

      this.setState({label})
    }
  }

  public render() {
    const {isVisible, onDismiss, onNameValidation} = this.props
    const {label} = this.state

    return (
      <Overlay visible={isVisible}>
        <Overlay.Container maxWidth={400}>
          <Overlay.Heading title="Create Label" onDismiss={onDismiss} />
          <Overlay.Body>
            <LabelOverlayForm
              id={label.id}
              name={label.name}
              onCloseModal={onDismiss}
              buttonText="Create Label"
              onSubmit={this.handleSubmit}
              isFormValid={this.isFormValid}
              color={label.properties.color}
              onNameValidation={onNameValidation}
              onInputChange={this.handleInputChange}
              onColorChange={this.handleColorChange}
              description={label.properties.description}
            />
          </Overlay.Body>
        </Overlay.Container>
      </Overlay>
    )
  }

  private get isFormValid(): boolean {
    const {label, colorStatus} = this.state

    const nameIsValid = this.props.onNameValidation(label.name) === null
    const colorIsValid =
      colorStatus === ComponentStatus.Default ||
      colorStatus === ComponentStatus.Valid

    return nameIsValid && colorIsValid
  }

  private handleSubmit = () => {
    const {onCreateLabel, onDismiss} = this.props

    try {
      onCreateLabel({...this.state.label, orgID: this.props.orgID})
      // clear form on successful submit
      this.resetForm()
    } finally {
      onDismiss()
    }
  }

  private resetForm() {
    this.setState({
      label: EMPTY_LABEL,
    })
  }

  private handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    const key = e.target.name

    if (key === 'description' || key === 'color') {
      const properties = {...this.state.label.properties, [key]: value}
      const label = {...this.state.label, properties}

      this.setState({
        label,
      })
    } else {
      const label = {...this.state.label, [key]: value}

      this.setState({
        label,
      })
    }
  }

  private handleColorChange = (
    color: string,
    colorStatus: ComponentStatus
  ): void => {
    const properties = {...this.state.label.properties, color}
    const label = {...this.state.label, properties}

    this.setState({label, colorStatus})
  }
}

const mstp = (state: AppState) => {
  const {orgs} = state

  return {orgID: _.get(orgs, '0.id', '')}
}

export default connect<StateProps, {}, OwnProps>(mstp)(CreateLabelOverlay)
