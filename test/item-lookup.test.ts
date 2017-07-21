import * as ItemLookup from '../src/item-lookup'
import * as assert from 'assert'
import * as fs from 'fs'


const FIXTURE_PATH = __dirname + '/fixtures/item-lookup'


function readJSON(path) {
  return JSON.parse( fs.readFileSync(path, 'utf-8') )
}


function makeTest(dir) {
  const path = FIXTURE_PATH + '/' + dir + '/'
  const raw = readJSON(path + 'raw.json')
  const expected = readJSON(path + 'parsed.json')

  const actual = ItemLookup.parse(raw)

  test(dir, () => {
    assert.deepEqual(actual, expected)
  })
}


suite('item-lookup', () => {
  fs.readdirSync(FIXTURE_PATH).forEach(makeTest)
})