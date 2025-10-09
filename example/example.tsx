// biome-ignore lint/correctness/noUnusedImports: <need>
import React, { createRef, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { rules, ValidatorField, ValidatorWrapper } from '../dist/index'

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

  return (
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
    </ValidatorWrapper>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(<App />)
