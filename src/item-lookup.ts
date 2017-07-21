import * as Item from './item'
import { IProductMap } from './types'
import { Result,
         IResult } from '@mcrowe/result'


export function parse(data): IResult<IProductMap> {
  try {

    if (isError(data)) {
      const msg = parseError(data).code
      const error = normalizeAmazonError(msg)
      return Result.Error(error)
    }

    const items = getItems(data)

    const map = {}

    for (let item of items) {
      const product = Item.parse(item)
      if (product.asin) {
        map[product.asin] = product
      }
    }

    return Result.OK(map)

  } catch (e) {
    console.error('parse_error ' + e)
    return Result.Error('parse_error')

  }
}


function isError(data) {
  return data.ItemLookupErrorResponse
}


function getItems(data) {
  const items = data.ItemLookupResponse.Items.Item

  if (Array.isArray(items)) {
    return items
  } else {
    return [items]
  }
}


function parseError(data) {
  const error = data.ItemLookupErrorResponse.Error
  return {
    code: error.Code,
    message: error.Message
  }
}


function normalizeAmazonError(msg: string): string {
  switch (msg) {
    case 'AWS.InvalidAssociate':
      return 'invalid_associate'
    case 'InvalidClientTokenId':
    case 'SignatureDoesNotMatch':
      return 'invalid_key'
    case 'RequestThrottled':
      return 'aws_throttle'
    case 'AWS.InternalError':
      return 'aws_internal_error'
    default:
      throw new Error('Unexpected amazon error: ' + msg)
  }
}