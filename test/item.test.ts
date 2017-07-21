import * as Item from '../src/item'
import * as assert from 'assert'
import * as fs from 'fs'



suite('item', () => {

  const fixturePath = __dirname + '/fixtures/item'

  fs.readdir(fixturePath, (_err, dirs) => {
    for (let dir of dirs) {
      test(dir, () => {
        const path = fixturePath + '/' + dir
        const raw = JSON.parse( fs.readFileSync(path + '/raw.json', 'utf-8') )
        const expected = JSON.parse( fs.readFileSync(path + '/parsed.json', 'utf-8') )

        const actual = Item.parse(raw)

        delete expected.variants
        delete actual.variants

        for (let k in actual) {
          if (typeof actual[k] == 'undefined') {
            delete actual[k]
          }
        }

        assert.deepEqual(actual, expected)
      })
    }
  })
})

  // test('parse', () => {
  //   const res = ItemLookup.parse(ERROR)

  //   assert.deepEqual({
  //     error: 'aws:RequestThrottled',
  //     ok: false
  //   }, res)
  // })

  // test('parse error', () => {
  //   const res = ItemLookup.parse(SUCCESS)

  //   assert.deepEqual({
  //     data: {},
  //     ok: true
  //   }, res)
  // })
