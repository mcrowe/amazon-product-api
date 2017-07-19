import assert = require('assert')
import doSomething from '../src'


suite('index', () => {})


test('index', () => {
  assert.equal(5, doSomething(1))
})