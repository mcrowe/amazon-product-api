import * as Item from './item'
import { IProduct } from './types'
import { Result,
         IResult } from '@mcrowe/result'


export function parse(data): IResult<IProduct> {
  try {

    if (isError(data)) {
      const msg = 'aws:' + parseError(data).code
      return Result.Error(msg)
    }

    const product = parseProduct(data)
    return Result.OK(product)

  } catch (e) {

    return Result.Error('parse_error')

  }
}


function isError(data) {
  return data.ItemLookupErrorResponse
}


function parseError(data) {
  const error = data.ItemLookupErrorResponse.Error
  return {
    code: error.Code,
    message: error.Message
  }
}


function parseProduct(data): IProduct {
  const item = data.ItemLookupResponse.Items.Item
  return Item.parse(item)
}