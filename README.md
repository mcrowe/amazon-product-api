# Amazon Product API

Typescript interface to Amazon product advertising api.

## Usage

> npm install @mcrowe/amazon-product-api --save


```js

import * as Amazon from '@mcrowe/amazon-product-api'

const key = {
  accessKeyId: '...',
  secretAccessKey: '...',
  associateTag: '...',
  locale: '...'
}

const result = await Amazon.getProduct(key, 'us', 'B01A...')

if (result.ok) {
  // result.data is the product data (see types.ts for structure)
} else {
  // result.error is a string error code (see "Results" below)
}

// Or, use the bulk api ...

const result = await Amazon.bulkGetProducts(key, 'us', ['B01A...', ...])

if (result.ok) {
  // result.data is a map from asin to product data
}

// For inventory 

const result = await Amazon.getInventory(key, 'us', 'B01A...')

if (result.ok) {
  // result.data returns inventory data (see types.ts for structure)
} else {
  // result.error is a string error code (see "Results" below)
}

```

## Results

Lots of things can go wrong when talking to the product api. This library is pessimistic and *assumes* something will go wrong. Requests return a result object which may represent success or failure. Errors are only thrown in cases that are trully exceptions (unexpected and unknown failure cases). This *should* never happen.

Here are a list of the known error codes that could occur:

- `fetch_error`: There was a fetch error on the client end when trying to get data from AWS.
- `parse_error`: The response from Amazon had an unexpected format and we choked when trying to parse it.
- `invalid_associate`: The amazon associate associated with the given key was not allowed to make this request
- `invalid_key`: The provided api key was not valid.
- `aws_server_error`: AWS had an internal server error.
- `aws_throttle`: Too many requests have been made on this key recently.
- `cart_error`: There was an error parsing the cart information from amazon.
- `unavailable_via_api`: The asin is unavailable via the product advertising api.

## Development

Install npm modules:

> npm install

Run tests:

> npm test

## Release

Release a new version:

> bin/release.sh

This will publish a new version to npm, as well as push a new tag up to github.

## TODO

- Proper variant parsing
- Proper image parsing?