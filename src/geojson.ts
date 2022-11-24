import { decodeBboxInt } from './bboxes';
import { decodeInt } from './hashing';
import { base32ToInt } from './helpers';
import { BASE32_BITS_PER_CHAR, MAX_BIT_DEPTH } from './constants';
import { GeoJsonFeature } from './types';

/**
 * Coverts a Geohash integer to a GeoJSON object,
 * where the encoded cell is represented by a
 * [Polygon]{@link https://www.rfc-editor.org/rfc/rfc7946#section-3.1.6}.
 * @see hashIntToRectangle
 * @param hashBase32 Base32 string (Geohash version of Base32)
 * @returns a {@link GeoJsonFeature} object.
 */
export function hashBase32ToRectangle(hashBase32: string) {
  const hashInt = base32ToInt(hashBase32);
  return hashIntToRectangle(hashInt, hashBase32.length * BASE32_BITS_PER_CHAR);
}

/**
 * Coverts a Geohash integer to a GeoJSON object,
 * where the encoded cell is represented by a
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
export function hashIntToRectangle(
  hashInt: number,
  bitDepth: number = MAX_BIT_DEPTH,
): GeoJsonFeature {
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
