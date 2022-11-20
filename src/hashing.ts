import { Coordinates } from './types';
import {
  assertBitDepthIsValid,
  assertLatLngIsValid,
  assertBase32HashLengthIsValid,
  base32ToInt,
  intToBase32,
  xor,
} from './helpers';
import {
  BASE32_CHAR_BIT_LENGTH,
  LATITUDE_MAX_VALUE,
  LONGITUDE_MAX_VALUE,
  BASE32_HASH_MAX_LENGTH,
  MAX_BIT_DEPTH,
} from './constants';

/**
 * Encodes coordinates and returns a Geohash Base32 string.
 * @param lat Latitude
 * @param lng Longitude
 * @param length Number of characters in the output string.
 * The bigger the value, the smaller the encoded cell.
 * Must be between 1 and 9.
 * @returns Geohash Base32 string (Geohash version of Base32).
 */
export function encodeBase32(lat: number, lng: number, length: number = BASE32_HASH_MAX_LENGTH) {
  assertLatLngIsValid(lat, lng);
  assertBase32HashLengthIsValid(length);

  const hashInt = encodeInt(lat, lng, length * BASE32_CHAR_BIT_LENGTH);
  return intToBase32(hashInt, length);
}

/**
 * Decodes a Geohash Base32 string.
 * @param hashBase32 Base32 string (Geohash version of Base32)
 * @returns {@link Coordinates} containing latitude, longitude and  corresponding error values.
 */
export function decodeBase32(hashBase32: string) {
  const hashInt = base32ToInt(hashBase32);
  return decodeInt(hashInt, hashBase32.length * BASE32_CHAR_BIT_LENGTH);
}

/**
 * Encodes coordinates and returns a Geohash integer.
 * @param lat Latitude
 * @param lng Longitude
 * @param bitDepth Defines precision of encoding.
 * The bigger the value, the smaller the encoded cell.
 * Can be either even or odd. Must be between 1 and 52.
 * @returns Geohash integer
 */
export function encodeInt(lat: number, lng: number, bitDepth: number = MAX_BIT_DEPTH) {
  assertLatLngIsValid(lat, lng);
  assertBitDepthIsValid(bitDepth);

  const latHash = encodeLatitude(lat, Math.floor(bitDepth / 2));
  const lngHash = encodeLongitude(lng, Math.ceil(bitDepth / 2));
  return mergeLatLngHashes(latHash, lngHash, bitDepth);
}

/**
 * Decodes a Geohash integer and returns coordinates.
 * @param hashInt Geohash integer
 * @param bitDepth Defines precision of the Geohash.
 * {@link Coordinates} containing latitude, longitude and  corresponding error values.
 */
export function decodeInt(hashInt: number, bitDepth: number = MAX_BIT_DEPTH): Coordinates {
  assertBitDepthIsValid(bitDepth);

  const { latHashInt, lngHashInt } = splitHashToLatLng(hashInt, bitDepth);
  const lat = decodeLatitude(latHashInt, Math.floor(bitDepth / 2));
  const lng = decodeLongitude(lngHashInt, Math.ceil(bitDepth / 2));

  return {
    lat: lat.value,
    lng: lng.value,
    error: {
      lat: lat.error,
      lng: lng.error,
    },
  };
}

export function mergeLatLngHashes(latHashInt: number, lngHashInt: number, bitDepth: number) {
  let hashInt = 0;
  let [latPrefix, lngPrefix] = [latHashInt, lngHashInt];

  const isDepthEven = bitDepth % 2 === 0;

  for (let i = 0; i < bitDepth; i++) {
    let bit;
    const isCurrentBitEven = i % 2 === 0;

    if (xor(isDepthEven, isCurrentBitEven)) {
      bit = lngPrefix % 2;
      lngPrefix = Math.floor(lngPrefix / 2);
    } else {
      bit = latPrefix % 2;
      latPrefix = Math.floor(latPrefix / 2);
    }

    hashInt += 2 ** i * bit;
  }

  return hashInt;
}

export function encodeLatitude(value: number, bitDepth: number) {
  return encodeCoordinate(value, bitDepth, LATITUDE_MAX_VALUE);
}

export function encodeLongitude(value: number, bitDepth: number) {
  return encodeCoordinate(value, bitDepth, LONGITUDE_MAX_VALUE);
}

export function encodeCoordinate(value: number, bitDepth: number, err: number) {
  let hashInt = 0;
  let remainder = value;
  let error = err;

  for (let i = 0; i < bitDepth; i++) {
    let bit;

    error /= 2;

    if (remainder >= 0) {
      bit = 1;
      remainder -= error;
    } else {
      bit = 0;
      remainder += error;
    }

    hashInt = hashInt * 2 + bit;
  }

  return hashInt;
}

export function splitHashToLatLng(
  hashInt: number,
  bitDepth: number,
): { latHashInt: number; lngHashInt: number } {
  let [latHashInt, lngHashInt] = [0, 0];
  let prefix = Math.floor(hashInt);

  const isDepthEven = bitDepth % 2 === 0;

  for (let i = 0; i < bitDepth; i++) {
    const bit = prefix % 2;
    const shiftedBit = 2 ** Math.floor(i / 2) * bit;
    const isCurrentBitEven = i % 2 === 0;

    if (xor(isDepthEven, isCurrentBitEven)) {
      lngHashInt += shiftedBit;
    } else {
      latHashInt += shiftedBit;
    }

    prefix = Math.floor(prefix / 2);
  }

  return { latHashInt, lngHashInt };
}

export function decodeLatitude(hashInt: number, bitDepth: number) {
  return decodeCoordinate(hashInt, bitDepth, 0, LATITUDE_MAX_VALUE);
}

export function decodeLongitude(hashInt: number, bitDepth: number) {
  return decodeCoordinate(hashInt, bitDepth, 0, LONGITUDE_MAX_VALUE);
}

export function decodeCoordinate(hashInt: number, bitDepth: number, mid: number, err: number) {
  let tail = hashInt;
  let value = mid;
  let error = err;

  for (let i = bitDepth - 1; i >= 0; i--) {
    const exponent = 2 ** i;
    const bit = Math.floor(tail / exponent);

    error /= 2;

    if (bit) {
      value += error;
    } else {
      value -= error;
    }

    tail -= bit * exponent;
  }

  return { value, error };
}
