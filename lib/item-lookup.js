"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Item = require("./item");
const result_1 = require("@mcrowe/result");
const ObjectPath = require("object-path");
const ERROR_PATH = ['ItemLookupErrorResponse', 'Error'];
const REQUEST_ERROR_PATH = ['ItemLookupResponse', 'Items', 'Request', 'Errors', 'Error'];
function parse(data) {
    try {
        const error = parseError(data);
        if (error) {
            const msg = normalizeAmazonError(error.code);
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
        console.error('AmazonProductApi: Error parsing data ' + e);
        return result_1.Result.Error('parse_error');
    }
}
exports.parse = parse;
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
    const error = ObjectPath.get(data, ERROR_PATH) || ObjectPath.get(data, REQUEST_ERROR_PATH);
    if (error) {
        return {
            code: error.Code,
            message: error.Message
        };
    }
}
function normalizeAmazonError(msg) {
    switch (msg) {
        case 'AWS.InvalidAssociate':
            return 'invalid_associate';
        case 'InvalidClientTokenId':
        case 'SignatureDoesNotMatch':
            return 'invalid_key';
        case 'RequestThrottled':
            return 'aws_throttle';
        case 'AWS.InternalError':
            return 'aws_server_error';
        case 'AWS.InvalidParameterValue':
            return 'aws_invalid_parameter_value';
        default:
            throw new Error('Unexpected amazon error: ' + msg);
    }
}
