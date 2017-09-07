"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_path_1 = require("object-path");
function parse(item, isVariant = false) {
    const attr = item.ItemAttributes || {};
    const dims = attr.PackageDimensions || {};
    const asin = item.ASIN;
    const imageUrl = parseImageUrl(item);
    const product = {
        asin,
        brand: attr.Brand,
        category: parseCategory(item),
        color: attr.Color,
        description: parseDescription(item),
        featureBullets: parseFeatureBullets(attr),
        name: attr.Title,
        height: parseDimension(dims, 'Height'),
        images: parseImages(item),
        imageUrl,
        length: parseDimension(dims, 'Length'),
        nSellers: parseNSellers(item),
        parentAsin: item.ParentASIN,
        price: parsePrice(item, isVariant),
        rank: parseNumber(item.SalesRank),
        variants: parseVariants(item),
        weight: parseDimension(dims, 'Weight'),
        width: parseDimension(dims, 'Width')
    };
    if (isVariant) {
        product.image = getVariantImage(asin, imageUrl);
    }
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
function parsePrice(item, isVariant) {
    const listPrice = object_path_1.get(item, ['ItemAttributes', 'ListPrice', 'Amount']);
    const totalOffers = object_path_1.get(item, ['Offers', 'TotalOffers']);
    const offer = firstChild(object_path_1.get(item, ['Offers', 'Offer']));
    const salePrice = object_path_1.get(offer, ['OfferListing', 'SalePrice', 'Amount']);
    const offerPrice = object_path_1.get(offer, ['OfferListing', 'Price', 'Amount']);
    let price;
    if (isVariant) {
        // NOTE: Variants never indicate Total Offers
        price = (salePrice || offerPrice) ? (salePrice || offerPrice) : listPrice;
    }
    else {
        price = (+totalOffers > 0 && (salePrice || offerPrice)) ? (salePrice || offerPrice) : listPrice;
    }
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
function parseVariants(item) {
    const items = object_path_1.get(item, ['Variations', 'Item']);
    if (items) {
        return items.map(item => parse(item, true));
    }
}
function getVariantImage(asin, imageUrl) {
    if (imageUrl) {
        return imageUrl.replace('_SL75_', '_SL150_').replace('http://ecx.images-amazon.com', 'https://images-na.ssl-images-amazon.com');
    }
    else {
        return `http://images.amazon.com/images/P/${asin}.01.ZTZZZZZZ.jpg`;
    }
}
function parseFeatureBullets(attr) {
    if (!attr) {
        return;
    }
    const feature = attr.Feature;
    if (Array.isArray(feature)) {
        return feature;
    }
    if (typeof feature == 'undefined') {
        return feature;
    }
    if (typeof feature == 'string') {
        return [feature];
    }
    throw new Error('Unexpected feature bullet format: ' + feature);
}
