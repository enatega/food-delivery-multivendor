const assert = require('node:assert/strict')
const {
  getSignedUrlExpiresAt,
  isSignedUrlExpired,
  stripQueryAndHash
} = require('../src/utils/signedMediaUrl')

assert.equal(stripQueryAndHash('https://cdn.test/image.jpg?Expires=123&Signature=x#fragment'), 'https://cdn.test/image.jpg')
assert.equal(getSignedUrlExpiresAt('https://cdn.test/image.jpg?Expires=123&Signature=x'), 123000)
assert.equal(getSignedUrlExpiresAt('https://cdn.test/image.jpg'), null)
assert.equal(isSignedUrlExpired('https://cdn.test/image.jpg?Expires=123', 123000), true)
assert.equal(isSignedUrlExpired('https://cdn.test/image.jpg?Expires=124', 123000), false)
