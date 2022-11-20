import { describe, expect, test } from '@jest/globals';
import {
  decodeInt,
  decodeBase32,
  encodeInt,
  encodeBase32,
  mergeLatLngHashes,
  splitHashToLatLng,
} from './hashing';
import { givenHash } from '../test/helpers';

describe('hashing module', () => {
  test('splits hash into latitude and longitude hashes', () => {
    const [hashInt, bitDepth] = givenHash('1100011111101011100011000011111');
    const expectedLatHashInt = parseInt('101110010010011', 2);
    const expectedLngHashInt = parseInt('1001111110100111', 2);

    const { latHashInt, lngHashInt } = splitHashToLatLng(hashInt, bitDepth);

    expect(latHashInt).toBe(expectedLatHashInt);
    expect(lngHashInt).toBe(expectedLngHashInt);
  });

  test('decodes int hash with even depth', () => {
    const [hashInt, bitDepth] = givenHash('11000111111010111000110000111110');
    const [expectedLat, expectedLng] = [40.183868408203125, 44.51385498046875];
    const [expectedLatError, expectedLngError] = [0.001373291015625, 0.00274658203125];

    const coords = decodeInt(hashInt, bitDepth);

    expect(coords.lat).toBe(expectedLat);
    expect(coords.error.lat).toBe(expectedLatError);
    expect(coords.lng).toBe(expectedLng);
    expect(coords.error.lng).toBe(expectedLngError);
  });

  test('decodes int hash with odd depth', () => {
    const [hashInt, bitDepth] = givenHash('1100011111101011100011000011111');
    const [expectedLat, expectedLng] = [40.18524169921875, 44.51385498046875];
    const [expectedLatError, expectedLngError] = [0.00274658203125, 0.00274658203125];

    const coords = decodeInt(hashInt, bitDepth);

    expect(coords.lat).toBe(expectedLat);
    expect(coords.error.lat).toBe(expectedLatError);
    expect(coords.lng).toBe(expectedLng);
    expect(coords.error.lng).toBe(expectedLngError);
  });

  test('throws error due to invalid bit depth', () => {
    const [hashInt] = givenHash('1100011111101011100011000011111');
    const tooSmallBitDepth = 0;
    const tooBigBitDepth = 53;

    expect(() => decodeInt(hashInt, tooSmallBitDepth)).toThrow(RangeError);
    expect(() => decodeInt(hashInt, tooBigBitDepth)).toThrow(RangeError);
  });

  test('merges latitude and longitude hashes into one', () => {
    const [latHashInt, latBitDepth] = givenHash('101110010010011');
    const [lngHashInt, lngBitDepth] = givenHash('1001111110100111');
    const bitDepth = latBitDepth + lngBitDepth;
    const [expectedHash] = givenHash('1100011111101011100011000011111');

    const hashInt = mergeLatLngHashes(latHashInt, lngHashInt, bitDepth);

    expect(hashInt).toBe(expectedHash);
  });

  test('encodes int hash with even depth', () => {
    const [lat, lng] = [40.183868408203125, 44.51385498046875];
    const bitDepth = 32;
    const [expectedHashInt] = givenHash('11000111111010111000110000111110');

    const hashInt = encodeInt(lat, lng, bitDepth);

    expect(hashInt).toBe(expectedHashInt);
  });

  test('encodes int hash with odd depth', () => {
    const [lat, lng] = [40.183868408203125, 44.51385498046875];
    const bitDepth = 31;
    const [expectedHashInt] = givenHash('1100011111101011100011000011111');

    const hashInt = encodeInt(lat, lng, bitDepth);

    expect(hashInt).toBe(expectedHashInt);
  });

  test('encodes base-32 hash', () => {
    const [lat, lng] = [37.8324, 112.5584];
    const expectedHashBase32 = 'ww8p1r4t8';

    const hashBase32 = encodeBase32(lat, lng);

    expect(hashBase32).toBe(expectedHashBase32);
  });

  test('throws error due to invalid base-32 hash length', () => {
    const [lat, lng] = [37.8324, 112.5584];
    const tooSmallLength = 0;
    const tooBigLength = 10;

    expect(() => encodeBase32(lat, lng, tooSmallLength)).toThrow(RangeError);
    expect(() => encodeBase32(lat, lng, tooBigLength)).toThrow(RangeError);
  });

  test('throws error due to invalid latitude or longitude', () => {
    const [lat, lng] = [37.8324, 112.5584];
    const [tooSmallLat, toSmallLng] = [-91, -1];
    const [tooBigLat, tooBigLng] = [91, 191];

    expect(() => encodeBase32(tooSmallLat, lng)).toThrow(RangeError);
    expect(() => encodeBase32(lat, toSmallLng)).toThrow(RangeError);
    expect(() => encodeBase32(tooBigLat, lng)).toThrow(RangeError);
    expect(() => encodeBase32(lat, tooBigLng)).toThrow(RangeError);
  });

  test('decodes base-32 hash', () => {
    const hashBase32 = 'ww8p1r4t8';
    const [expectedLat, expectedLng] = [37.83238649368286, 112.55838632583618];

    const { lat, lng } = decodeBase32(hashBase32);

    expect(lat).toBe(expectedLat);
    expect(lng).toBe(expectedLng);
  });

  test('throws error due to invalid character in base-32 hash', () => {
    const hashBase32 = 'wi8p1r4t8';

    expect(() => decodeBase32(hashBase32)).toThrow(RangeError);
  });
});
