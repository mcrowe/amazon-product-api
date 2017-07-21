"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item = require("./item");
const result_1 = require("@mcrowe/result");
function parse(data) {
    try {
        if (isError(data)) {
            const msg = 'aws:' + parseError(data).code;
            return result_1.Result.Error(msg);
        }
        const items = getItems(data);
        const map = {};
        for (let item of items) {
            const product = Item.parse(item);
            if (product.asin) {
                map[product.asin] = product;
            }
        }
        return result_1.Result.OK(map);
    }
    catch (e) {
        console.error('parse_error ' + e);
        return result_1.Result.Error('parse_error');
    }
}
exports.parse = parse;
function isError(data) {
    return data.ItemLookupErrorResponse;
}
function getItems(data) {
    const items = data.ItemLookupResponse.Items.Item;
    if (Array.isArray(items)) {
        return items;
    }
    else {
        return [items];
    }
}
function parseError(data) {
    const error = data.ItemLookupErrorResponse.Error;
    return {
        code: error.Code,
        message: error.Message
    };
}
