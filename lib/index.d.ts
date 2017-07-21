import { IKey, IProduct, IProductMap } from './types';
import { IResult } from '@mcrowe/result';
export { IKey, IProduct, IProductMap } from './types';
export declare function getProduct(key: IKey, country: string, asin: string): Promise<IResult<IProduct>>;
export declare function bulkGetProducts(key: IKey, country: string, asins: string[]): Promise<IResult<IProductMap>>;
