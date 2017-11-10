import { IKey, IProduct, IProductMap, IInventory } from './types';
import { IResult } from '@mcrowe/result';
export { IKey, IProduct, IInventory, IProductMap } from './types';
export declare function getProduct(key: IKey, country: string, asin: string): Promise<IResult<IProduct>>;
export declare function getInventory(key: IKey, country: string, asin: string): Promise<IResult<IInventory>>;
export declare function bulkGetProducts(key: IKey, country: string, asins: string[]): Promise<IResult<IProductMap>>;
