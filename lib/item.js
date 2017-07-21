"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_path_1 = require("object-path");
function parse(item) {
    const attr = item.ItemAttributes || {};
    const dims = attr.PackageDimensions || {};
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
    };
    // NOTE: We remove any undefined fields in order to make
    // test fixtures easier to work with.
    clean(product);
    return product;
}
exports.parse = parse;
/**
 * Remove any keys with undefined values from an object.
 */
function clean(obj) {
    for (let k in obj) {
        if (typeof obj[k] == 'undefined') {
            delete obj[k];
        }
    }
}
function parseNSellers(item) {
    return parseNumber(object_path_1.get(item, ['OfferSummary', 'TotalNew']));
}
function parseDescription(item) {
    const reviews = object_path_1.get(item, ['EditorialReviews', 'EditorialReview']) || [];
    const review = firstChild(reviews);
    if (review) {
        return review.Content;
    }
}
function parseNumber(str) {
    const x = parseFloat(str);
    if (Number.isNaN(x)) {
        return;
    }
    else {
        return x;
    }
}
function parseImageUrl(item) {
    const image = item.SmallImage;
    if (image) {
        return image.URL;
    }
}
function parseDimension(dims, key) {
    const val = xmlValue(dims, key);
    if (typeof val === 'string') {
        const num = parseNumber(val);
        if (typeof num != 'undefined') {
            return num / 100;
        }
    }
}
function xmlValue(obj, key) {
    return obj[key] && obj[key]['_'];
}
function parseImages(item) {
    const images = object_path_1.get(item, ['ImageSets', 'ImageSet']);
    return ensureArray(images);
}
function parseCategory(item) {
    let nodes = ensureArray(object_path_1.get(item, ['BrowseNodes', 'BrowseNode'])) || [];
    for (let node of nodes) {
        while (node.Ancestors) {
            if (node.IsCategoryRoot == '1') {
                const name = node.Ancestors.BrowseNode.Name;
                if (name) {
                    return name;
                }
            }
            node = node.Ancestors.BrowseNode;
        }
    }
}
function parsePrice(item) {
    const listPrice = object_path_1.get(item, ['ItemAttributes', 'ListPrice', 'Amount']);
    const totalOffers = object_path_1.get(item, ['Offers', 'TotalOffers']);
    const offer = firstChild(object_path_1.get(item, ['Offers', 'Offer']));
    const salePrice = object_path_1.get(offer, ['OfferListing', 'SalePrice', 'Amount']);
    const offerPrice = object_path_1.get(offer, ['OfferListing', 'Price', 'Amount']);
    const price = (+totalOffers > 0 && (salePrice || offerPrice)) ? salePrice || offerPrice : listPrice;
    const num = parseNumber(price);
    if (num) {
        return num / 100;
    }
}
function firstChild(x) {
    if (Array.isArray(x)) {
        return x[0];
    }
    else {
        return x;
    }
}
function ensureArray(x) {
    if (typeof x == 'undefined' || Array.isArray(x)) {
        return x;
    }
    else {
        return [x];
    }
}
