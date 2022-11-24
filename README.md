# geohashing

TypeScript-written [Geohash](https://en.wikipedia.org/wiki/Geohash) library for Node.js.

<a href="https://www.npmjs.com/geohashing" target="_blank">
    <img alt="npm" src="https://img.shields.io/npm/v/geohashing?color=brightgreen">
</a>
<a href="https://www.npmjs.com/geohashing" target="_blank">
    <img alt="NPM" src="https://img.shields.io/npm/l/geohashing?color=blue">
</a>
<a href="https://github.com/arseny034/geohashing/actions/workflows/ci.yml" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/arseny034/geohashing/CI">
</a>
<a href="https://app.codacy.com/gh/arseny034/geohashing" target="_blank">
    <img alt="Codacy coverage" src="https://img.shields.io/codacy/coverage/e2a2c3470d9d446ca7e754b78acb3660/main">
</a>
<a href="https://app.codacy.com/gh/arseny034/geohashing" target="_blank">
    <img alt="Codacy grade" src="https://img.shields.io/codacy/grade/e2a2c3470d9d446ca7e754b78acb3660/main">
</a>

## Install

```shell
npm install geohashing
```
or
```shell
yarn add geohashing
```

## Usage
```typescript
import { encodeBase32, decodeBase32 } from 'geohashing';

const hash = encodeBase32(40.1838684, 44.5138549);
console.log(hash);

const { lat, lng, error } = decodeBase32(hash);
console.log(`Latitude: ${lat}±${error.lat}`);
console.log(`Longitude: ${lng}±${error.lng}`);
```

## Support of two Geohash formats
Geohash can be either an integer number or Base32 string (Geohash uses its own [Base32 variant](https://en.wikipedia.org/wiki/Base32#Geohash)).
Precision of a Geohash integer is defined by bit depth, which must be between 1 and 52.
Precision of a Geohash Base32 string is defined by the string length, which must be between 1 and 9.

Bit depth can be either odd or even.
Odd bit depth results in equal latitude and longitude errors,
which means that an encoded cell must be square.
However, due to nonlinearity of the coordinate system, it depends on latitude a lot
(compare [the cell at the equator](https://geojson.io/#data=data:application/json,%7B%0A%20%20%22type%22%3A%20%22Feature%22%2C%0A%20%20%22bbox%22%3A%20%5B%0A%20%20%20%2043.9947509765625%2C%0A%20%20%20%200%2C%0A%20%20%20%2044.000244140625%2C%0A%20%20%20%200.0054931640625%0A%20%20%5D%2C%0A%20%20%22geometry%22%3A%20%7B%0A%20%20%20%20%22type%22%3A%20%22Polygon%22%2C%0A%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%200%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2044.000244140625%2C%0A%20%20%20%20%20%20%20%20%20%200%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2044.000244140625%2C%0A%20%20%20%20%20%20%20%20%20%200.0054931640625%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%200.0054931640625%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%200%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%5D%0A%20%20%7D%2C%0A%20%20%22properties%22%3A%20%7B%0A%20%20%20%20%22lat%22%3A%200.00274658203125%2C%0A%20%20%20%20%22lng%22%3A%2043.99749755859375%2C%0A%20%20%20%20%22error%22%3A%20%7B%0A%20%20%20%20%20%20%22lat%22%3A%200.00274658203125%2C%0A%20%20%20%20%20%20%22lng%22%3A%200.00274658203125%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)
and [more northerly cell](https://geojson.io/#data=data:application/json,%7B%0A%20%20%22type%22%3A%20%22Feature%22%2C%0A%20%20%22bbox%22%3A%20%5B%0A%20%20%20%2043.9947509765625%2C%0A%20%20%20%2040.49560546875%2C%0A%20%20%20%2044.000244140625%2C%0A%20%20%20%2040.5010986328125%0A%20%20%5D%2C%0A%20%20%22geometry%22%3A%20%7B%0A%20%20%20%20%22type%22%3A%20%22Polygon%22%2C%0A%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%2040.49560546875%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2044.000244140625%2C%0A%20%20%20%20%20%20%20%20%20%2040.49560546875%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2044.000244140625%2C%0A%20%20%20%20%20%20%20%20%20%2040.5010986328125%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%2040.5010986328125%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%2040.49560546875%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%5D%0A%20%20%7D%2C%0A%20%20%22properties%22%3A%20%7B%0A%20%20%20%20%22lat%22%3A%2040.49835205078125%2C%0A%20%20%20%20%22lng%22%3A%2043.99749755859375%2C%0A%20%20%20%20%22error%22%3A%20%7B%0A%20%20%20%20%20%20%22lat%22%3A%200.00274658203125%2C%0A%20%20%20%20%20%20%22lng%22%3A%200.00274658203125%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)).

Even bit depth results in a rectangle cell.
Supposing we had a square cell encoded with 31 bit depth,
encoding the same coordinates with 32 bit depth would result in half the square
([example](https://geojson.io/#data=data:application/json,%7B%0A%20%20%22type%22%3A%20%22Feature%22%2C%0A%20%20%22bbox%22%3A%20%5B%0A%20%20%20%2043.9947509765625%2C%0A%20%20%20%200%2C%0A%20%20%20%2044.000244140625%2C%0A%20%20%20%200.00274658203125%0A%20%20%5D%2C%0A%20%20%22geometry%22%3A%20%7B%0A%20%20%20%20%22type%22%3A%20%22Polygon%22%2C%0A%20%20%20%20%22coordinates%22%3A%20%5B%0A%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%200%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2044.000244140625%2C%0A%20%20%20%20%20%20%20%20%20%200%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2044.000244140625%2C%0A%20%20%20%20%20%20%20%20%20%200.00274658203125%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%200.00274658203125%0A%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%5B%0A%20%20%20%20%20%20%20%20%20%2043.9947509765625%2C%0A%20%20%20%20%20%20%20%20%20%200%0A%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%5D%0A%20%20%20%20%5D%0A%20%20%7D%2C%0A%20%20%22properties%22%3A%20%7B%0A%20%20%20%20%22lat%22%3A%200.001373291015625%2C%0A%20%20%20%20%22lng%22%3A%2043.99749755859375%2C%0A%20%20%20%20%22error%22%3A%20%7B%0A%20%20%20%20%20%20%22lat%22%3A%200.001373291015625%2C%0A%20%20%20%20%20%20%22lng%22%3A%200.00274658203125%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D)).

## Encoding and decoding

### encodeInt(lat, lng \[, bitDepth])
Encodes coordinates and returns a Geohash integer.
`bitDepth` defines precision of encoding.
The bigger the value, the smaller the encoded cell.

### encodeBase32(lat, lng \[, length])
Encodes coordinates and returns a Geohash Base32 string. 
`length` is a number of characters in the output string.
The bigger the value, the smaller the encoded cell.

### decodeInt(hashInt \[, bitDepth])
Decodes a Geohash integer and returns an object with coordinates:
```typescript
{
  lat: string;
  lng: string;
  error: {
    lat: string;
    lng: string;
  } 
}
```

### decodeBase32(hashBase32)
Decodes a Geohash Base32 string and returns an object with coordinates like `decodeInt()`.

## Neighbors

### getNeighborInt(hashInt, direction \[, bitDepth])
Calculates a Geohash integer of a neighbor cell.
`direction` specifies which neighbor should be found (e.g. northern, southwestern, etc.)

### getNeighborBase32(hashBase32, direction)
Calculates Geohash Base32 string of a neighbor cell.

### getNeighborsInt(hashInt \[, bitDepth])
Calculates Geohash integers of all neighbor cells. Returns a `Neghbors` object with the following properties:
```typescript
{
  north:     number;
  northEast: number;
  east:      number;
  southEast: number;
  south:     number;
  southWest: number;
  west:      number;
  northWest: number;
}
```

### getNeighborsBase32(hashBase32)
Calculates Geohash Base32 strings of all neighbor cells.
Returns a `Neghbors` object similar to what `getNeighborsInt()` returns, but containing string properties instead.

## Bounding boxes

### decodeBboxInt(hashInt \[, bitDepth])
Calculates edge coordinates of the encoded cell.
Takes a Geohash integer.
Returns a `Bbox` object with coordinates: 
```typescript
{ 
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}
```

### decodeBboxBase32(hashBase32)
Calculates edge coordinates of the encoded cell.
Takes a Geohash Base32 string.
Returns a `Bbox` object similar to what `decodeBboxInt()` returns.

### getHashesWithinBboxInt(minLat, minLng, maxLat, maxLng \[, bitDepth])
Calculates all Geohash integer values within the box.
Returns an array of Geohash integers.

### getHashesWithinBboxBase32(minLat, minLng, maxLat, maxLng \[, length])
Calculates all Geohash Base32 values within the box.
Returns an array of Geohash Base32 strings.

## Base32

### intToBase32(intValue, precision)
Convert an integer to a base-32 string (Geohash Base32 variant is used).
Precision is required to fill the output with leading zeros if necessary.

### base32ToInt(base32Value)
Convert a base-32 string to an integer (Geohash Base32 variant is used).

## GeoJSON
The library can convert Geohash to [GeoJSON](https://ru.wikipedia.org/wiki/GeoJSON) Feature.

### hashIntToRectangle(hashInt \[, bitDepth])
Takes a Geohash integer and bit depth and returns a GeoJSON object,
where the encoded cell is represented by a [Polygon](https://www.rfc-editor.org/rfc/rfc7946#section-3.1.6)
(see [example](https://geojson.io/#data=data:application/json,%7B%22type%22%3A%22Feature%22%2C%22bbox%22%3A%5B44.5111083984375%2C40.1824951171875%2C44.5166015625%2C40.18798828125%5D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B44.5111083984375%2C40.1824951171875%5D%2C%5B44.5166015625%2C40.1824951171875%5D%2C%5B44.5166015625%2C40.18798828125%5D%2C%5B44.5111083984375%2C40.18798828125%5D%2C%5B44.5111083984375%2C40.1824951171875%5D%5D%5D%7D%2C%22properties%22%3A%7B%22lat%22%3A40.18524169921875%2C%22lng%22%3A44.51385498046875%2C%22error%22%3A%7B%22lat%22%3A0.00274658203125%2C%22lng%22%3A0.00274658203125%7D%7D%7D)).

### hashBase32ToRectangle(hashBase32)
Takes a Geohash Base32 string and returns a GeoJSON object, like `hashIntToRectangle()` does.

## License
geohashing is MIT licensed.
