import * as ItemLookup from './item-lookup'
import { IKey,
         IProduct,
         IProductMap } from './types'
import { Result,
         IResult } from '@mcrowe/result'
import * as apac from 'apac'


export { IKey,
         IProduct,
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
    assocId: key.associateTag
  }

  const response = await new apac.OperationHelper(options).execute('ItemLookup', {
    ItemId: asins.join(','),
    ItemType: 'ASIN',
    ResponseGroup: RESPONSE_GROUP,
    locale: country.toUpperCase()
  })

  return response.result
}