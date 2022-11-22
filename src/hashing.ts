import { Coordinates } from './types';
import {
  assertBitDepthIsValid,
  assertLatLngIsValid,
  assertBase32HashLengthIsValid,
  base32ToInt,
  intToBase32,
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

  return encodeIntNoValidation(lat, lng, bitDepth);
}

/**
 * Decodes a Geohash integer and returns coordinates.
 * @param hashInt Geohash integer
 * @param bitDepth Defines precision of the Geohash.
 * {@link Coordinates} containing latitude, longitude and  corresponding error values.
 */
export function decodeInt(hashInt: number, bitDepth: number = MAX_BIT_DEPTH): Coordinates {
  assertBitDepthIsValid(bitDepth);

  return decodeIntNoValidation(hashInt, bitDepth);
}

export function encodeIntNoValidation(lat: number, lng: number, bitDepth: number) {
  let hashInt = 0;
  let [latResidual, lngResidual] = [lat, lng];
  let [latError, lngError] = [LATITUDE_MAX_VALUE, LONGITUDE_MAX_VALUE];

  for (let i = bitDepth - 1; i >= 0; i--) {
    let bit;

    if ((bitDepth - i) % 2) {
      lngError /= 2;

      if (lngResidual >= 0) {
        bit = 1;
        lngResidual -= lngError;
      } else {
        bit = 0;
        lngResidual += lngError;
      }
    } else {
      latError /= 2;

      if (latResidual >= 0) {
        bit = 1;
        latResidual -= latError;
      } else {
        bit = 0;
        latResidual += latError;
      }
    }

    hashInt = hashInt * 2 + bit;
  }

  return hashInt;
}

export function decodeIntNoValidation(hashInt: number, bitDepth: number) {
  let tail = hashInt;
  let [latValue, latError] = [0, LATITUDE_MAX_VALUE];
  let [lngValue, lngError] = [0, LONGITUDE_MAX_VALUE];
  let exponent = 2 ** bitDepth;

  for (let i = bitDepth - 1; i >= 0; i--) {
    exponent /= 2;
    const bit = Math.floor(tail / exponent);

    if ((bitDepth - i) % 2) {
      lngError /= 2;

      if (bit) {
        lngValue += lngError;
      } else {
        lngValue -= lngError;
      }
    } else {
      latError /= 2;

      if (bit) {
        latValue += latError;
      } else {
        latValue -= latError;
      }
    }

    tail -= bit * exponent;
  }

  return {
    lat: latValue,
    lng: lngValue,
    error: {
      lat: latError,
      lng: lngError,
    },
  };
}
