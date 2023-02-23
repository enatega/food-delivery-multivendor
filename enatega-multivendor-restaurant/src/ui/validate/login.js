import { validate } from 'validate.js'

const constraints = {
  username: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 20
    }
  },
  password: {
    presence: true,
    length: {
      minimum: 3,
      maximum: 20
    }
  }
}

export default function validateFunc(form) {
  return validate(form, constraints)
}
