import { Component, type ReactNode, type RefObject } from 'react'

import { Context } from './context'
import type { Validity } from './types'
import { type Field, Validator } from './validator'

interface ComponentProps {
  children?: ReactNode
  stopAtFirstError?: boolean
  ref?: RefObject<ValidatorWrapper>
}

export class ValidatorWrapper extends Component<ComponentProps> {
  fields = []
  state = {
    customErrors: [],
  }

  constructor(props) {
    super(props)
    this.registerField = this.registerField.bind(this)
    this.unregisterField = this.unregisterField.bind(this)
  }

  componentWillUnmount() {
    this.fields = []
  }

  registerField(field) {
    if (field && !this.fields.includes(field)) {
      this.fields.push(field)
    }
  }

  unregisterField(field) {
    const index = this.fields.indexOf(field)
    if (index > -1) this.fields.splice(index, 1)
  }

  getField(id): Field | null {
    return this.fields.find((field) => field.props.id === id) || null
  }

  setCustomError(customError: Validity) {
    this.setState({
      customErrors: [...this.state.customErrors, customError],
    })
  }

  clearCustomErrors() {
    this.setState({ customErrors: [] })
  }

  validate(): Validity {
    const validator = new Validator({ stopAtFirstError: this.props.stopAtFirstError })
    for (const comp of this.fields) {
      validator.addField(comp.props)
    }
    return validator.validate()
  }

  render(): ReactNode {
    return (
      <Context.Provider
        value={{
          customErrors: this.state.customErrors,
          registerField: this.registerField,
          unregisterField: this.unregisterField,
        }}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}
