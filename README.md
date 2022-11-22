geohashing
==========

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
Precision of a Geohash integer is defined by bit depth which can be either even or odd,
and must be between 1 and 52.
Precision of a Geohash Base32 string is defined by the string length, which must be between 1 and 9.

## Encoding and decoding

### encodeInt(lat, lng [, bitDepth])

Encodes coordinates and returns a Geohash integer.
`bitDepth` defines precision of encoding.
The bigger the value, the smaller the encoded cell.

### encodeBase32(lat, lng [, length])

Encodes coordinates and returns a Geohash Base32 string. 
`length` is a number of characters in the output string.
The bigger the value, the smaller the encoded cell.

### decodeInt(hashInt [, bitDepth])

Decodes a Geohash integer and returns an object with coordinates:
`{ lat, lng, error: { lat, lng } }`

### decodeBase32(hashBase32)

Decodes a Geohash Base32 string and returns an object with coordinates like `decodeInt()`.

## Neighbors

### getNeighborInt(hashInt, direction [, bitDepth])

Calculates a Geohash integer of a neighbor cell.
`direction` specifies which neighbor should be found (e.g. northern, southwestern, etc.)

### getNeighborBase32(hashBase32, direction)

Calculates Geohash Base32 string of a neighbor cell.

### getNeighborsInt(hashInt [, bitDepth])

Calculates Geohash integers of all neighbor cells. Returns an array of 8 numbers.

### getNeighborsBase32(hashBase32)

Calculates Geohash Base32 strings of all neighbor cells. Returns an array of 8 strings.

## Boxes

### decodeBoxInt(hashInt [, bitDepth])

Calculates edge coordinates of the encoded cell.
Takes a Geohash integer.
Returns an object with coordinates: `{ minLat, minLng, maxLat, maxLng }`.

### decodeBoxBase32(hashBase32)

Calculates edge coordinates of the encoded cell.
Takes a Geohash Base32 string.
Returns an object with coordinates: `{ minLat, minLng, maxLat, maxLng }`.

### getHashesWithinBoxInt(minLat, minLng, maxLat, maxLng [, bitDepth])

Calculates all Geohash integer values within the box.
Returns an array of Geohash integers.

### getHashesWithinBoxBase32(minLat, minLng, maxLat, maxLng [, length])

Calculates all Geohash Base32 values within the box.
Returns an array of Geohash Base32 strings.

## Base32

### intToBase32(intValue, precision)

Convert an integer to a base-32 string (Geohash Base32 variant is used).
Precision is required to fill the output with leading zeros if necessary.

### base32ToInt(base32Value)

Convert a base-32 string to an integer (Geohash Base32 variant is used).

## License

geohashing is MIT licensed.
