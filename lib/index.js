"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ItemLookup = require("./item-lookup");
const result_1 = require("@mcrowe/result");
const apac = require("apac");
const RESPONSE_GROUP = 'Large,Variations';
function getProduct(key, country, asin) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield bulkGetProducts(key, country, [asin]);
        if (res.ok) {
            return result_1.Result.OK(res.data[asin]);
        }
        else {
            return res;
        }
    });
}
exports.getProduct = getProduct;
function bulkGetProducts(key, country, asins) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield itemLookup(key, country, asins);
            return ItemLookup.parse(data);
        }
        catch (e) {
            return result_1.Result.Error('fetch_error');
        }
    });
}
exports.bulkGetProducts = bulkGetProducts;
function itemLookup(key, country, asins) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            awsId: key.accessKeyId,
            awsSecret: key.secretAccessKey,
            assocId: key.associateTag,
            locale: country.toUpperCase()
        };
        const response = yield new apac.OperationHelper(options).execute('ItemLookup', {
            ItemId: asins.join(','),
            ItemType: 'ASIN',
            ResponseGroup: RESPONSE_GROUP
        });
        return response.result;
    });
}
