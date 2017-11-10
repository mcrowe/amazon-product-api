import * as ItemLookup from './item-lookup'
import * as Cart from './cart'
import { IKey,
         IProduct,
         IProductMap,
         IInventory } from './types'
import { Result,
         IResult } from '@mcrowe/result'
import * as apac from 'apac'


export { IKey,
         IProduct,
         IInventory,
         IProductMap } from './types'


const RESPONSE_GROUP = 'Large,Variations'


export async function getProduct(key: IKey, country: string, asin: string): Promise<IResult<IProduct>> {
  const res = await bulkGetProducts(key, country, [asin])

  if (res.ok) {
    return Result.OK(res.data[asin])
  } else {
    return res
  }
}


export async function getInventory(key: IKey, country: string, asin: string): Promise<IResult<IInventory>> {
  try {
    const data = await cartCreate(key, country, asin)

    await cartClear(key, country, data)

    return Cart.parse(data)
  } catch (e) {
    return Result.Error('fetch_error')
  }
}


export async function bulkGetProducts(key: IKey, country: string, asins: string[]): Promise<IResult<IProductMap>> {
  try {
    const data = await itemLookup(key, country, asins)

    return ItemLookup.parse(data)
  } catch (e) {
    return Result.Error('fetch_error')
  }
}


async function itemLookup(key: IKey, country: string, asins: string[]) {
  const options = {
    awsId: key.accessKeyId,
    awsSecret: key.secretAccessKey,
    assocId: key.associateTag,
    locale: country.toUpperCase()
  }

  const response = await new apac.OperationHelper(options).execute('ItemLookup', {
    ItemId: asins.join(','),
    ItemType: 'ASIN',
    ResponseGroup: RESPONSE_GROUP
  })

  return response.result
}


async function cartCreate(key: IKey, country: string, asin: string) {
  const options = {
    awsId: key.accessKeyId,
    awsSecret: key.secretAccessKey,
    assocId: key.associateTag,
    locale: country.toUpperCase()
  }

  const response = await new apac.OperationHelper(options).execute('CartCreate', {
    'Item.1.ASIN': asin,
    'Item.1.Quantity': 999,
  })

  return response.result
}


async function cartClear(key: IKey, country: string, data) {
  const options = {
    awsId: key.accessKeyId,
    awsSecret: key.secretAccessKey,
    assocId: key.associateTag,
    locale: country.toUpperCase()
  }

  const response = await new apac.OperationHelper(options).execute('CartClear', {
    'CartId': data.CartId,
    'HMAC': data.HMAC
  })

  return response.result
}