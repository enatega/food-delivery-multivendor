import { validate } from 'validate.js'

const constraints = {
  confirmPassword: {
    presence: {
      allowEmpty: false
    },
    equality: {
      attribute: 'password',
      message: '^The passwords does not match'
    }
  },
  prefix: {
    presence: {
      allowEmpty: false
    }
  },
  email: {
    email: true
  },
  password: {
    presence: {
      allowEmpty: false
    }
  },
  phone: {
    presence: {
      allowEmpty: false,
      message: "number is required."
    },
    length: {
      maximum: 25,
      tooLong: "number invalid"
    }
  },
  address: {
    presence: {
      allowEmpty: false
    }
  },
  lat: {
    presence: {
      allowEmpty: false
    }
  },
  deliveryCharges: {
    presence: {
      allowEmpty: false
    }
  },
  deliveryRate: {
    presence: {
      allowEmpty: false
    }
  },
  deliveryTime: {
    presence: {
      allowEmpty: false
    }
  },
  minimumOrder: {
    presence: {
      allowEmpty: false
    }
  },
  orderPrefix: {
    presence: true
  },
  long: {
    presence: {
      allowEmpty: false
    }
  },
  name: {
    presence: {
      allowEmpty: false
    }
  },
  username: {
    presence: {
      allowEmpty: false,
      message: '^UsernameCannotBeBlank'
    },
    format: {
      pattern: /^[^\s]+$/,
      message: '^UsernameCannotContainSpaces'
    }
  },
  title: {
    presence: {
      allowEmpty: false
    }
  },
  description: {
    presence: {
      allowEmpty: false
    }
  },
  categoryTitle: {
    presence: true,
    length: {
      minimum: 1,
      maximum: 25
    }
  },
  categoryDescription: {
    presence: true,
    length: {
      minimum: 0,
      maximum: 60
    }
  },
  category: {
    presence: {
      allowEmpty: false
    }
  },
  zone: {
    presence: true,
    length: {
      minimum: 5
    }
  },
  price: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      greaterThan: 0
    }
  },
  discounted: {},
  type: {
    presence: true,
    length: {
      minimum: 1,
      maximum: 6
    }
  },
  mongoUrl: {
    url: {
      scheme: ['mongodb']
    }
  },
  currencyCode: {
    presence: {
      allowEmpty: false
    }
  },
  currencySymbol: {
    presence: {
      allowEmpty: false
    }
  },
  reason: {
    presence: true,
    length: {
      minimum: 1,
      maximum: 30
    }
  },
  optionTitle: {
    presence: {
      allowEmpty: false
    }
  },
  optionDescription: {
    presence: {
      allowEmpty: false
    }
  },
  optionPrice: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      greaterThanOrEqualTo: 0
    }
  },
  addonTitle: {
    presence: {
      allowEmpty: false
    }
  },
  addonDescription: {
    presence: {
      allowEmpty: false
    }
  },
  addonQuantityMinimum: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      greaterThanOrEqualTo: 0
    }
  },
  addonQuantityMaximum: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      greaterThanOrEqualTo: 1
    }
  },
  tag: {
    presence: {
      allowEmpty: false
    }
  },
  stock: {
    presence: true,
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0
    }
  },
  code: {
    presence: {
      allowEmpty: false
    }
  },
  discount: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      greaterThan: 0,
      lessThan: 100
    }
  },
  tip: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      greaterThanOrEqualTo: 0,
      lessThan: 100
    }
  },
  tax: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      greaterThan: 0
    }
  },
  taxationCharges: {
    presence: {
      allowEmpty: false
    },
    numericality: {
      greaterThanOrEqualTo: 0
    }
  },
  title: {
    presence: {
      allowEmpty: false
    },
  },
  action: {
    presence: {
      allowEmpty: false
    },
  },
  screen: {
    presence: {
      allowEmpty: false
    },
  }
}

export const validateFunc = (value, constraint) => {
  return validate(value, { [constraint]: constraints[constraint] })
}
export const validateFuncForRider = (value, constraint) => {
  const validationResult = validate(value, {
    [constraint]: constraints[constraint]
  })
  if (validationResult !== undefined && validationResult !== null) {
    if (!constraints[constraint]) {
      return { isValid: false, errorMessage: 'Invalid constraint' }
    }
    return { isValid: false, errorMessage: validationResult[constraint][0] 
    }
  } else {
    return { isValid: true, errorMessage: null }
  }
}

