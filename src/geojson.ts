import { decodeBboxInt } from './bboxes';
import { decodeInt } from './hashing';
import { base32ToInt } from './helpers';
import { BASE32_BITS_PER_CHAR, MAX_BIT_DEPTH } from './constants';

export function hashBase32ToRectangle(hashBase32: string) {
  const hashInt = base32ToInt(hashBase32);
  return hashIntToRectangle(hashInt, hashBase32.length * BASE32_BITS_PER_CHAR);
}

export function hashIntToRectangle(hashInt: number, bitDepth: number = MAX_BIT_DEPTH) {
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
