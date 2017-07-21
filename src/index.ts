import * as ItemLookup from './item-lookup'
import { IKey,
         IProduct } from './types'
import { Result,
         IResult } from '@mcrowe/result'
import * as apac from 'apac'


const RESPONSE_GROUP = 'Large,Variations'


export async function getProduct(key: IKey, country: string, asin: string): Promise<IResult<IProduct>> {
  const res = await bulkGetProducts(key, country, [asin])

  if (res.ok) {
    return Result.OK(res.data[asin])
  } else {
    return res
  }
}


export async function bulkGetProducts(key: IKey, country: string, asins: string[]): Promise<IResult<IProduct>> {
  try {
    const data = await itemLookup(key, country, asins)

    return ItemLookup.parse(data)
  } catch (e) {
    return Result.Error('fetch_error')
  }
}


async function itemLookup(key: IKey, country: string, asins: string[]) {
  const response = await new apac.OperationHelper(key).execute('ItemLookup', {
    ItemId: asins.join(','),
    ItemType: 'ASIN',
    ResponseGroup: RESPONSE_GROUP,
    locale: country.toUpperCase()
  })

  return response.result
}