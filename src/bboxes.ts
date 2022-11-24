import {
  assertBitDepthIsValid,
  assertLatLngIsValid,
  assertBase32HashLengthIsValid,
  base32ToInt,
  intToBase32,
} from './helpers';
import { Bbox } from './types';
import { decodeInt, encodeInt, encodeIntNoValidation } from './hashing';
import { BASE32_CHAR_BIT_LENGTH, BASE32_HASH_MAX_LENGTH, MAX_BIT_DEPTH } from './constants';

/**
 * Calculates all Geohash Base32 values within the bounding box.
 * @param minLat Southwestern corner latitude
 * @param minLng Southwestern corner longitude
 * @param maxLat Northeastern corner latitude
 * @param maxLng Northeastern corner longitude
 * @param length Number of characters in the output string.
 * The bigger the value, the smaller the encoded cell.
 * Must be between 1 and 9.
 * @returns Array of Geohash Base32 strings.
 */
export function getHashesWithinBboxBase32(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
  length: number = BASE32_HASH_MAX_LENGTH,
) {
  assertLatLngIsValid(minLat, minLng);
  assertLatLngIsValid(maxLat, maxLng);
  assertBase32HashLengthIsValid(length);

  const hashesInt = getHashesWithinBboxInt(
    minLat,
    minLng,
    maxLat,
    maxLng,
    length * BASE32_CHAR_BIT_LENGTH,
  );
  return hashesInt.map((hashInt) => intToBase32(hashInt, length));
}

/**
 * Calculates all Geohash integer values within the bounding box.
 * @param minLat Southwestern corner latitude
 * @param minLng Southwestern corner longitude
 * @param maxLat Northeastern corner latitude
 * @param maxLng Northeastern corner longitude
 * @param bitDepth Defines precision of encoding.
 * The bigger the value, the smaller the encoded cell.
 * Can be either even or odd. Must be between 1 and 52.
 * @returns Array of Geohash integers.
 */
export function getHashesWithinBboxInt(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
  bitDepth: number = MAX_BIT_DEPTH,
) {
  assertLatLngIsValid(minLat, minLng);
  assertLatLngIsValid(maxLat, maxLng);
  assertBitDepthIsValid(bitDepth);

  const southWestHashInt = encodeInt(minLat, minLng, bitDepth);
  const northEastHashInt = encodeInt(maxLat, maxLng, bitDepth);

  const { error } = decodeInt(southWestHashInt, bitDepth);
  const [latStep, lngStep] = [error.lat * 2, error.lng * 2];

  const { minLat: latFrom, minLng: lngFrom } = decodeBboxInt(southWestHashInt, bitDepth);
  const { maxLat: latTo, maxLng: lngTo } = decodeBboxInt(northEastHashInt, bitDepth);

  const hashesInt: number[] = [];

  for (let lat = latFrom + error.lat; lat < latTo; lat += latStep) {
    for (let lng = lngFrom + error.lng; lng < lngTo; lng += lngStep) {
      hashesInt.push(encodeIntNoValidation(lat, lng, bitDepth));
    }
  }

  return hashesInt;
}

/**
 * Calculates bounding box coordinates of the encoded cell.
 * @param hashBase32 Base32 string (Geohash version of Base32)
 * @returns A {@link Bbox} with coordinates: `minLat`, `minLng`, `maxLat`, `maxLng`.
 */
export function decodeBboxBase32(hashBase32: string) {
  const hashInt = base32ToInt(hashBase32);
  return decodeBboxInt(hashInt, hashBase32.length * BASE32_CHAR_BIT_LENGTH);
}

/**
 * Calculates bounding box coordinates of the encoded cell.
 * @param hashInt Geohash integer
 * @param bitDepth Defines precision of encoding.
 * The bigger the value, the smaller the encoded cell.
 * Can be either even or odd. Must be between 1 and 52.
 * @returns A {@link Bbox} with coordinates: `minLat`, `minLng`, `maxLat`, `maxLng`.
 */
export function decodeBboxInt(hashInt: number, bitDepth: number = MAX_BIT_DEPTH): Bbox {
  assertBitDepthIsValid(bitDepth);

  const { lat, lng, error } = decodeInt(hashInt, bitDepth);
  return {
    minLat: lat - error.lat,
    minLng: lng - error.lng,
    maxLat: lat + error.lat,
    maxLng: lng + error.lng,
  };
}
