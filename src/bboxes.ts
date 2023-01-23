import {
  assertBitDepthIsValid,
  assertLatLngIsValid,
  assertBase32HashLengthIsValid,
  base32ToInt,
  intToBase32,
} from './helpers';
import { Bbox, HashInt } from './types';
import { decodeInt, decodeIntNoValidation, encodeIntNoValidation } from './hashing';
import { BASE32_BITS_PER_CHAR, BASE32_HASH_MAX_LENGTH, MAX_BIT_DEPTH } from './constants';

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
    length * BASE32_BITS_PER_CHAR,
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

  const southWestHashInt = encodeIntNoValidation(minLat, minLng, bitDepth);
  const northEastHashInt = encodeIntNoValidation(maxLat, maxLng, bitDepth);

  const { error } = decodeInt(southWestHashInt, bitDepth);
  const [latStep, lngStep] = [error.lat * 2, error.lng * 2];

  const { minLat: latFrom, minLng: lngFrom } = decodeBboxIntNoValidation(
    southWestHashInt,
    bitDepth,
  );
  const { maxLat: latTo, maxLng: lngTo } = decodeBboxIntNoValidation(northEastHashInt, bitDepth);

  const hashesInt: number[] = [];

  for (let lat = latFrom + error.lat; lat < latTo; lat += latStep) {
    for (let lng = lngFrom + error.lng; lng < lngTo; lng += lngStep) {
      hashesInt.push(encodeIntNoValidation(lat, lng, bitDepth));
    }
  }

  return hashesInt;
}

/**
 * Finds a Geohash Base32 string that represents the smallest cell which the given bbox fits into.
 * @param minLat Southwestern corner latitude
 * @param minLng Southwestern corner longitude
 * @param maxLat Northeastern corner latitude
 * @param maxLng Northeastern corner longitude
 * @returns a Geohash Base32 string or `null` if the bbox cannot be represented by a Geohash
 * as it occupies both eastern and western hemispheres
 */
export function encodeBboxBase32(minLat: number, minLng: number, maxLat: number, maxLng: number) {
  const hashIntObject = encodeBboxInt(minLat, minLng, maxLat, maxLng);
  if (!hashIntObject) {
    return null;
  }

  const { hashInt, bitDepth } = hashIntObject;
  const shiftOrder = bitDepth % BASE32_BITS_PER_CHAR;
  const shiftedHashInt = Math.floor(hashInt / 2 ** shiftOrder);
  const length = Math.floor(bitDepth / BASE32_BITS_PER_CHAR);

  return intToBase32(shiftedHashInt, length);
}

/**
 * Calculates bounding box coordinates of the encoded cell.
 * @param hashBase32 Base32 string (Geohash version of Base32)
 * @returns A {@link Bbox} with coordinates: `minLat`, `minLng`, `maxLat`, `maxLng`.
 */
export function decodeBboxBase32(hashBase32: string) {
  const hashInt = base32ToInt(hashBase32);
  return decodeBboxInt(hashInt, hashBase32.length * BASE32_BITS_PER_CHAR);
}

/**
 * Finds a Geohash integer that represents the smallest cell which the given bbox fits into.
 * @param minLat Southwestern corner latitude
 * @param minLng Southwestern corner longitude
 * @param maxLat Northeastern corner latitude
 * @param maxLng Northeastern corner longitude
 * @returns a {@link HashInt} containing a Geohash integer and bit depth
 * or `null` if the bbox cannot be represented by a Geohash as it occupies
 * both eastern and western hemispheres
 */
export function encodeBboxInt(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): HashInt | null {
  assertLatLngIsValid(minLat, minLng);
  assertLatLngIsValid(maxLat, maxLng);

  const [lat, lng] = [minLat + (maxLat - minLat) / 2, minLng + (maxLng - minLng) / 2];
  let hashInt = encodeIntNoValidation(lat, lng, MAX_BIT_DEPTH);

  for (let i = MAX_BIT_DEPTH; i > 0; i--) {
    const bbox = decodeBboxIntNoValidation(hashInt, i);

    if (
      bbox.minLat <= minLat &&
      bbox.minLng <= minLng &&
      bbox.maxLat >= maxLat &&
      bbox.maxLng >= maxLng
    ) {
      return { hashInt, bitDepth: i };
    }

    hashInt = Math.floor(hashInt / 2);
  }

  return null;
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

  return decodeBboxIntNoValidation(hashInt, bitDepth);
}

export function decodeBboxIntNoValidation(hashInt: number, bitDepth: number): Bbox {
  const { lat, lng, error } = decodeIntNoValidation(hashInt, bitDepth);
  return {
    minLat: lat - error.lat,
    minLng: lng - error.lng,
    maxLat: lat + error.lat,
    maxLng: lng + error.lng,
  };
}
