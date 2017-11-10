import * as Cart from '../src/cart'
import * as assert from 'assert'
import * as fs from 'fs'


const FIXTURE_PATH = __dirname + '/fixtures/cart'


function readJSON(path) {
  return JSON.parse( fs.readFileSync(path, 'utf-8') )
}


function makeTest(dir) {
  const path = FIXTURE_PATH + '/' + dir + '/'
  const raw = readJSON(path + 'raw.json')
  const expected = readJSON(path + 'parsed.json')

  const actual = Cart.parse(raw)

  test(dir, () => {
    assert.deepEqual(actual, expected)
  })
}


suite('cart', () => {
  fs.readdirSync(FIXTURE_PATH).forEach(makeTest)
})