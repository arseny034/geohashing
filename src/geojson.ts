import { decodeBboxInt } from './bboxes';
import { decodeInt } from './hashing';
import { base32ToInt } from './helpers';
import { BASE32_BITS_PER_CHAR, MAX_BIT_DEPTH } from './constants';
import { GeoJsonFeature, GeoJsonGeometryMultiPolygon, GeoJsonGeometryPolygon } from './types';

/**
 * Converts an array of Geohash Base32 strings
 * to GeoJSON Feature with MultiPolygon geometry.
 * @param hashBase32Array Array of Geohash Base32 strings
 * @returns GeoJSON Feature object with MultiPolygon geometry
 */
export function hashBase32ArrayToMultiPolygon(hashBase32Array: string[]) {
  const hashIntArray = hashBase32Array.map<[number, number]>((hashBase32) => [
    base32ToInt(hashBase32),
    hashBase32.length * BASE32_BITS_PER_CHAR,
  ]);
  return hashIntArrayToMultiPolygon(hashIntArray);
}

/**
 * Converts an array of Geohash integer/bit depth pairs
 * to GeoJSON Feature with MultiPolygon geometry.
 * MultiPolygon contains all rectangle areas encoded with provided geohashes.
 * @param hashIntArray Array of Geohash integer/bit depth pairs
 * @returns GeoJSON Feature object with MultiPolygon geometry
 */
export function hashIntArrayToMultiPolygon(
  hashIntArray: [number, number][],
): GeoJsonFeature<GeoJsonGeometryMultiPolygon> {
  const coordinates = hashIntArray.map<[number, number][][]>(([hashInt, bitDepth]) => {
    const { minLat, minLng, maxLat, maxLng } = decodeBboxInt(hashInt, bitDepth);
    return [
      [
        [minLng, minLat],
        [maxLng, minLat],
        [maxLng, maxLat],
        [minLng, maxLat],
        [minLng, minLat],
      ],
    ];
  });

  return {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates,
    },
    properties: null,
  };
}

/**
 * Coverts a Geohash integer to a GeoJSON object,
 * where the encoded cell is represented by a rectangular
 * [Polygon]{@link https://www.rfc-editor.org/rfc/rfc7946#section-3.1.6}.
 * @see hashIntToPolygon
 * @param hashBase32 Base32 string (Geohash version of Base32)
 * @returns a {@link GeoJsonFeature} object.
 */
export function hashBase32ToPolygon(hashBase32: string) {
  const hashInt = base32ToInt(hashBase32);
  return hashIntToPolygon(hashInt, hashBase32.length * BASE32_BITS_PER_CHAR);
}

/**
 * Coverts a Geohash integer to a GeoJSON object,
 * where the encoded cell is represented by a rectangular
 * [Polygon]{@link https://www.rfc-editor.org/rfc/rfc7946#section-3.1.6}.
 * @example GeoJSON object
 * {
 *   type: 'Feature',
 *   bbox: [-4.3505859375, 48.6474609375, -4.306640625, 48.69140625],
 *   geometry: {
 *     type: 'Polygon',
 *     coordinates: [
 *       [
 *         [-4.3505859375, 48.6474609375],
 *         [-4.306640625, 48.6474609375],
 *         [-4.306640625, 48.69140625],
 *         [-4.3505859375, 48.69140625],
 *         [-4.3505859375, 48.6474609375]
 *       ]
 *     ]
 *   },
 *   properties: {
 *     lat: 48.66943359375,
 *     lng: -4.32861328125,
 *     error: {
 *       lat: 0.02197265625,
 *       lng: 0.02197265625
 *     }
 *   }
 * }
 * @param hashInt Geohash integer
 * @param bitDepth Defines precision of the Geohash.
 * @returns a {@link GeoJsonFeature} object.
 */
export function hashIntToPolygon(
  hashInt: number,
  bitDepth: number = MAX_BIT_DEPTH,
): GeoJsonFeature<GeoJsonGeometryPolygon> {
  const { lat, lng, error } = decodeInt(hashInt, bitDepth);
  const { minLat, minLng, maxLat, maxLng } = decodeBboxInt(hashInt, bitDepth);

  return {
    type: 'Feature',
    bbox: [minLng, minLat, maxLng, maxLat],
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [minLng, minLat],
          [maxLng, minLat],
          [maxLng, maxLat],
          [minLng, maxLat],
          [minLng, minLat],
        ],
      ],
    },
    properties: {
      lat,
      lng,
      error,
    },
  };
}
