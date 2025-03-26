import { validate } from 'validate.js'

const constraints = {
  username: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 20,
      tooShort: 'must be at least %{count} characters long.'
    }
  },
  password: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 20,
      tooShort: 'must be at least %{count} characters long.'
    }
  }
}

export default function validateFunc(form) {
  return validate(form, constraints)
}
