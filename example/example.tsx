/* eslint no-console: [0] */
import { createRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

import { Validator, ValidatorField, ValidatorWrapper, rules } from '../dist/index'

function App() {
  const [email, setEmail] = useState('')
  const jsxValidator = createRef<ValidatorWrapper>()

  function handleValidateEmail() {
    const { isValid, message, errors } = jsxValidator.current.validate()
    if (!isValid) {
      console.log(isValid, message, errors)
      return
    }
    console.log('success')
  }

  function handleValidateCustomFields() {
    const validator = new Validator({ stopAtFirstError: true })
    const fieldPassword = validator.addField({
      rules: rules.password,
      value: '',
      id: 'for-remove',
    })

    const fieldSearchPassword = validator.getField('for-remove')
    console.log(fieldPassword === fieldSearchPassword)

    validator.removeField(fieldPassword)

    validator.addField({
      rules: rules.password,
      value: 'testpassword',
    })

    const { isValid, message, errors } = validator.validate()
    if (!isValid) {
      console.log(isValid, message, errors)
      return
    }
    console.log('success')
  }

  return (
    <>
      <ValidatorWrapper ref={jsxValidator}>
        <ValidatorField rules={rules.email} value={email}>
          {({ isValid, message }) => (
            <>
              <input onChange={({ target: { value } }) => setEmail(value)} />
              <div>{isValid ? 'valid' : 'invalid'}</div>
              <div>{message || ''}</div>
              <button onClick={handleValidateEmail} type="button">
                Validate email
              </button>
            </>
          )}
        </ValidatorField>
        <button onClick={handleValidateCustomFields} type="button">
          Validate custom fields
        </button>
      </ValidatorWrapper>
    </>
  )
}

const root = createRoot(document.getElementById('root'))

root.render(<App />)
