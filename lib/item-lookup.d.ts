import { IProduct } from './types';
import { IResult } from '@mcrowe/result';
export interface IProductMap {
    [asin: string]: IProduct;
}
export declare function parse(data: any): IResult<IProductMap>;
