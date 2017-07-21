// import assert = require('assert')
// import * as Api from '../src'

/**
 * NOTE: These tests are useful for debugging, but they are
 * inconsistent, so we don't want them to run all the time.
 */

// test('getProduct', async () => {
//   const key = {
//     awsId: 'AKIAII2GLKRWTJZBQ22A',
//     awsSecret: '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',
//     assocId: 'dsfnseyrgwejr-20'
//   }
//   const res = await Api.getProduct(key, 'us', 'B000067QMK')

//   assert.equal(5, res)
// })


// test('bulkGetProducts', async () => {
//   const key = {
//     awsId: 'AKIAII2GLKRWTJZBQ22A',
//     awsSecret: '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',
//     assocId: 'dsfnseyrgwejr-20'
//   }
//   const res = await Api.bulkGetProducts(key, 'us', ['B000067QMK', 'B000J53J36'])

//   assert.equal(5, res)
// })