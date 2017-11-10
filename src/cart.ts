import { IInventory } from './types'
import { Result,
         IResult } from '@mcrowe/result'

export function parse(data): IResult<IInventory> {
  try {

    if (isError(data)) {
      const msg = parseError(data.CartCreateErrorResponse).code
      const error = normalizeAmazonError(msg)
      return Result.Error(error)
    }

    const cart = getCart(data)

    if (!cart.CartItems && isCartError(cart)) {
      const msg = parseError(cart.Request.Errors).code
      const error = normalizeAmazonError(msg)
      return Result.Error(error)
    }
    
    const inventory = getInventory(cart)

    return Result.OK({ inventory })

  } catch (e) {
    console.error('parse_error ' + e)
    return Result.Error('parse_error')
  }
}


function isError(data) {
  return data.CartCreateErrorResponse
}


function isCartError(data) {
  return data.Request.Errors
}


function getCart(data) {
  return data.CartCreateResponse.Cart
}


function getInventory(cart) {
  const q = cart.CartItems.CartItem.Quantity

  return q && parseInt(q)
}


function parseError(data) {
  const error = data.Error

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
    case 'AWS.ECommerceService.CartInfoMismatch':
      return 'cart_error'
    case 'AWS.ECommerceService.ItemNotEligibleForCart':
      return 'unavailable'
    case 'AWS.ECommerceService.ItemNotAccessible':
      return 'unavailable_via_api'
    case 'AWS.InternalError':
      return 'aws_server_error'
    default:
      throw new Error('Unexpected amazon error: ' + msg)
  }
}