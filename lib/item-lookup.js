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
        const product = parseProduct(data);
        return result_1.Result.OK(product);
    }
    catch (e) {
        return result_1.Result.Error('parse_error');
    }
}
exports.parse = parse;
function isError(data) {
    return data.ItemLookupErrorResponse;
}
function parseError(data) {
    const error = data.ItemLookupErrorResponse.Error;
    return {
        code: error.Code,
        message: error.Message
    };
}
function parseProduct(data) {
    const item = data.ItemLookupResponse.Items.Item;
    return Item.parse(item);
}
