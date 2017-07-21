import { IKey, IProduct } from './types';
import { IResult } from '@mcrowe/result';
export declare function getProduct(key: IKey, country: string, asin: string): Promise<IResult<IProduct>>;
export declare function bulkGetProducts(key: IKey, country: string, asins: string[]): Promise<IResult<IProduct>>;
