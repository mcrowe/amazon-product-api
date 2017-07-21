export interface IKey {
  accessKeyId: string
  secretAccessKey: string
  associateTag: string
}


export interface IProduct {
  asin?: string
  brand?: string
  category?: string
  color?: string
  description?: string
  featureBullets?: string[]
  name?: string
  height?: number
  images?: any
  imageUrl?: string
  length?: number
  nSellers?: number
  parentAsin?: string
  price?: number
  rank?: number
  variants?: any
  weight?: number
  width?: number
}