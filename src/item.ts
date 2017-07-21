import { IProduct } from './types'
import { get } from 'object-path'


export function parse(item): IProduct {
  const attr = item.ItemAttributes || {}
  const dims = attr.PackageDimensions || {}

  const product = {
    asin: item.ASIN,
    brand: attr.Brand,
    category: parseCategory(item),
    color: attr.Color,
    description: parseDescription(item),
    featureBullets: attr.Feature,
    name: attr.Title,
    height: parseDimension(dims, 'Height'),
    images: parseImages(item),
    imageUrl: parseImageUrl(item),
    length: parseDimension(dims, 'Length'),
    nSellers: parseNSellers(item),
    parentAsin: item.ParentASIN,
    price: parsePrice(item),
    rank: parseNumber(item.SalesRank),
    variants: [],
    weight: parseDimension(dims, 'Weight'),
    width: parseDimension(dims, 'Width')
  }

  // NOTE: We remove any undefined fields in order to make
  // test fixtures easier to work with.
  clean(product)

  return product
}


/**
 * Remove any keys with undefined values from an object.
 */
function clean(obj: object) {
  for (let k in obj) {
    if (typeof obj[k] == 'undefined') {
      delete obj[k]
    }
  }
}


function parseNSellers(item) {
  return parseNumber(get(item, ['OfferSummary', 'TotalNew']))
}


function parseDescription(item): string | undefined {
  const reviews = get(item, ['EditorialReviews', 'EditorialReview']) || []

  const review = firstChild(reviews)

  if (review) {
    return review.Content
  }
}


function parseNumber(str: string): number | undefined {
  const x = parseFloat(str)
  if (Number.isNaN(x)) {
    return
  } else {
    return x
  }
}


function parseImageUrl(item): string | undefined {
  const image = item.SmallImage

  if (image) {
    return image.URL
  }
}


function parseDimension(dims, key: string): number | undefined {
  const val = xmlValue(dims, key)

  if (typeof val === 'string') {
    const num = parseNumber(val)

    if (typeof num != 'undefined') {
      return num / 100
    }
  }
}


function xmlValue(obj, key): string | undefined {
  return obj[key] && obj[key]['_']
}


function parseImages(item) {
  const images = get(item, ['ImageSets', 'ImageSet'])
  return ensureArray(images)
}


function parseCategory(item): string | undefined {
  let nodes = ensureArray( get(item, ['BrowseNodes', 'BrowseNode']) ) || []

  for (let node of nodes) {
    while (node.Ancestors) {
      if (node.IsCategoryRoot == '1') {
        const name = node.Ancestors.BrowseNode.Name
        if (name) {
          return name
        }
      }
      node = node.Ancestors.BrowseNode
    }
  }
}


function parsePrice(item): number | undefined {
  const listPrice = get(item, ['ItemAttributes', 'ListPrice', 'Amount'])
  const totalOffers = get(item, ['Offers', 'TotalOffers'])

  const offer = firstChild( get(item, ['Offers', 'Offer']) )

  const salePrice = get(offer, ['OfferListing', 'SalePrice', 'Amount'])
  const offerPrice = get(offer, ['OfferListing', 'Price', 'Amount'])

  const price = (+totalOffers > 0 && (salePrice || offerPrice)) ? salePrice || offerPrice : listPrice

  const num = parseNumber(price)

  if (num) {
    return num / 100
  }
}


function firstChild(x) {
  if (Array.isArray(x)) {
    return x[0]
  } else {
    return x
  }
}


function ensureArray(x) {
  if (typeof x == 'undefined' || Array.isArray(x)) {
    return x
  } else {
    return [x]
  }
}