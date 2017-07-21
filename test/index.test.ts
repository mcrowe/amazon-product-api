import assert = require('assert')
import * as Api from '../src'


test('getProduct', async () => {
  const key = {
    awsId: 'AKIAII2GLKRWTJZBQ22A',
    awsSecret: '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',
    assocId: 'dsfnseyrgwejr-20'
  }
  const res = await Api.getProduct(key, 'us', 'B000067QMK')

  assert.equal(5, res)
})