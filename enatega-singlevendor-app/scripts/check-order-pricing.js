const assert = require('assert')
const { transformFileSync } = require('@babel/core')
const Module = require('module')
const path = require('path')

function load(relativePath) {
  const filename = path.resolve(__dirname, relativePath)
  const code = transformFileSync(filename, {
    babelrc: false,
    configFile: false,
    plugins: ['@babel/plugin-transform-modules-commonjs']
  }).code
  const loaded = new Module(filename)
  loaded.filename = filename
  loaded.paths = module.paths
  loaded._compile(code, filename)
  return loaded.exports
}

const { calculateOrderPricing } = load('../src/utils/orderPricing.js')
const pricing = calculateOrderPricing({
  cart: [{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }],
  discountPercent: 10,
  taxPercent: 5,
  delivery: 2.5,
  tip: 3
})

assert.deepStrictEqual(pricing, {
  subtotal: 25,
  discountedSubtotal: 22.5,
  discountAmount: 2.5,
  taxationAmount: 1.25,
  tipAmount: 3,
  total: 29.25
})

const { populateCart } = load('../src/utils/populateCart.js')
const restaurant = {
  categories: [{ foods: [{ _id: 'food', title: 'Pizza', image: 'pizza.jpg', variations: [{ _id: 'large', title: 'Large', price: 10, addons: ['addon'] }] }] }],
  addons: [{ _id: 'addon' }],
  options: [{ _id: 'cheese', title: 'Cheese', price: 2 }]
}
const populated = populateCart(restaurant, [
  { key: 'item', _id: 'food', quantity: 2, variation: { _id: 'large' }, addons: [{ _id: 'addon', options: [{ _id: 'cheese' }] }] },
  { key: 'missing', _id: 'missing', quantity: 1, variation: { _id: 'none' } }
])

assert.strictEqual(populated.length, 1)
assert.strictEqual(populated[0].price, '12.00')
assert.deepStrictEqual(populated[0].optionsTitle, ['Cheese'])
assert.strictEqual(populated[0].cartItem.key, 'item')
console.log('Ordering utility checks passed')
