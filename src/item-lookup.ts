import * as Item from './item'
import { IProduct } from './types'
import { Result,
         IResult } from '@mcrowe/result'


export interface IProductMap {
  [asin: string]: IProduct
}


export function parse(data): IResult<IProductMap> {
  try {

    if (isError(data)) {
      const msg = 'aws:' + parseError(data).code
      return Result.Error(msg)
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