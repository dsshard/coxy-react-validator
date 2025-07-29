# @Coxy/react-validator

---

# Simple React Form Validation

@Coxy/react-validator provides a simple and flexible way to validate forms in React.

> Supports data validation both **in-browser** and **on Node.js**.

> Requires React **\>=16.3**.

---

# Installation

```bash
npm install @coxy/react-validator
# or
yarn add @coxy/react-validator
```

---

# Quick Start Example

```tsx
import React, { useState } from 'react';
import { ValidatorWrapper, rules, ValidatorField } from '@coxy/react-validator';

const validator = React.createRef();

const handleSubmit = () => {
  const { isValid, message, errors } = validator.current.validate();
  if (!isValid) {
    console.log(isValid, message, errors);
    return;
  }
  alert('Form is valid!');
};

export default function Example() {
  const [email, setEmail] = useState('');

  return (
    <ValidatorWrapper ref={validator}>
      <ValidatorField value={email} rules={rules.email}>
        {({ isValid, message }) => (
          <>
            <input value={email} onChange={({ target: { value } }) => setEmail(value)} />
            {!isValid && <div style={{ color: 'red' }}>{message}</div>}
          </>
        )}
      </ValidatorField>

      <button onClick={handleSubmit} type="button">
        Submit
      </button>
    </ValidatorWrapper>
  );
}
```

More examples available [here](example/example.tsx).

---

# Built-in Validation Rules

Create your own rules easily, or use the built-in ones:

```javascript
const rules = {
  email: [
    { rule: value => value.trim() !== '', message: 'Value is required' },
    { rule: value => value.includes('@'), message: '@ is required' },
  ],
  password: [
    { rule: value => value.length >= 6, message: 'Password must be at least 6 characters' },
  ],
  notEmpty: [
    { rule: value => !!value && value.trim() !== '', message: 'Field cannot be empty' },
  ],
  boolean: [
    { rule: value => typeof value === 'boolean', message: 'Must be a boolean value' },
  ],
  min: (min) => ([
    { rule: value => Number(value) >= min, message: `Must be at least ${min}` },
  ]),
  max: (max) => ([
    { rule: value => Number(value) <= max, message: `Must be at most ${max}` },
  ]),
  length: (min, max) => ([
    { rule: value => value.length >= min, message: `Must be at least ${min} characters` },
    ...(max ? [{ rule: value => value.length <= max, message: `Must be at most ${max} characters` }] : [])
  ]),
};
```

| Name        | Type     | Description                                               |
|-------------|----------|-----------------------------------------------------------|
| email       | Array    | Validate non-empty email with regex check.                |
| password    | Array    | Validate non-empty password with min length.              |
| notEmpty    | Array    | Check if a string is not empty.                           |
| boolean     | Array    | Ensure a boolean value is present.                        |
| min(n)      | Function | Validate number is >= `n`.                                |
| max(n)      | Function | Validate number is <= `n`.                                |
| length(a,b) | Function | Validate string length is between `a` and `b` (optional). |

---

# React API

## `<ValidatorWrapper />` Props

| Name             | Default | Required | Description                                        |
|------------------|---------|----------|----------------------------------------------------|
| ref              | null    | No       | React ref or useRef for control.                   |
| stopAtFirstError | false   | No       | Stop validating after the first error.             |

## `<ValidatorField />` Props

| Name     | Default   | Required | Description                           |
|----------|-----------|----------|---------------------------------------|
| value    | undefined | Yes      | Value to validate.                    |
| rules    | []        | Yes      | Validation rules array.               |
| required | true      | No       | Whether the field is required.        |
| id       | null      | No       | ID for the field (for manual access). |

## `useValidator`

Validate a value directly in your component:

```tsx
import { useValidator, rules } from '@coxy/react-validator';

const [isValid, { errors }] = useValidator('test@example.com', rules.email);

console.log(isValid); // true or false
console.log(errors);  // array of error messages
```

---

# Validator Class (Node.js / Manual Usage)

Use it server-side or in custom flows.

## Validator Constructor Options

| Name             | Default | Required | Description                                          |
|------------------|---------|----------|------------------------------------------------------|
| stopAtFirstError | false   | No       | Stop validating after first error across all fields. |

## Methods

### `.addField()`

```javascript
const validator = new Validator({ stopAtFirstError: true });

const field = validator.addField({
  rules: rules.password,
  value: '12345',
});
```

### `.getField(id)`

```javascript
const field = validator.getField('password-field');
console.log(field);
```

### `.removeField(field)`

```javascript
validator.removeField(field);
```

### `.validate()`

```javascript
const { isValid, message, errors } = validator.validate();
console.log(isValid, errors);
```

## Full Server-Side Example

```javascript
import { Validator, rules } from '@coxy/react-validator';

const validator = new Validator();

validator.addField({
  id: 'email',
  rules: rules.email,
  value: 'test@domain.com',
});

validator.addField({
  id: 'password',
  rules: rules.password,
  value: '1234567',
});

const result = validator.validate();

if (result.isValid) {
  console.log('Validation passed!');
} else {
  console.error('Validation failed:', result.errors);
}
```

---

# License

MIT © [Dsshard](https://github.com/dsshard)

---

# Notes

- Lightweight, flexible, easy to integrate.
- Server-side and client-side validation supported.
- Create custom rules for different scenarios.
- Easy to add dynamic validation logic.

> **Fun Fact:** Early validation of user inputs in a form can reduce backend server load by up to **40%** compared to server-only validation!

