import { Direction, Neighbors } from './types';
import { assertBitDepthIsValid, base32ToInt, intToBase32 } from './helpers';
import { decodeInt, encodeInt } from './hashing';
import { BASE32_CHAR_BIT_LENGTH, MAX_BIT_DEPTH } from './constants';

/**
 * Calculates all neighbors' Base32 Geohashes.
 * @param hashBase32 Base32 string (Geohash version of Base32)
 * @returns A {@link Neighbors} with Base32 Geohashes starting from North
 */
export function getNeighborsBase32(hashBase32: string) {
  const precision = hashBase32.length;
  const hashInt = base32ToInt(hashBase32);

  const neighborsInt = getNeighborsInt(hashInt, precision * BASE32_CHAR_BIT_LENGTH);
  const neighborsBase32Entries: [string, string][] = Object.entries(neighborsInt).map(
    ([direction, neighborHashInt]) => [direction, intToBase32(neighborHashInt, precision)],
  );
  return Object.fromEntries(neighborsBase32Entries) as Neighbors<string>;
}

/**
 * Calculates all neighbors' integer Geohashes.
 * @param hashInt Geohash integer
 * @param bitDepth Defines precision of encoding.
 * The bigger the value, the smaller the encoded cell.
 * Can be either even or odd. Must be between 1 and 52.
 * @returns A {@link Neighbors} with Geohash integers starting from North.
 */
export function getNeighborsInt(hashInt: number, bitDepth: number = MAX_BIT_DEPTH) {
  assertBitDepthIsValid(bitDepth);

  const neighborsIntEntries = Object.values(Direction).map((direction) => [
    direction,
    getNeighborInt(hashInt, direction, bitDepth),
  ]);
  return Object.fromEntries(neighborsIntEntries) as Neighbors<number>;
}

/**
 * Calculates neighbor's Geohash Base32 string.
 * @param hashBase32 Base32 string (Geohash version of Base32) whose neighbor should be found.
 * @param direction Specifies which neighbor should be found (e.g. northern, southwestern, etc.)
 * @returns Neighbor's Base32 Geohash.
 */
export function getNeighborBase32(hashBase32: string, direction: Direction) {
  const precision = hashBase32.length;
  const hashInt = base32ToInt(hashBase32);
  const neighborHashInt = getNeighborInt(hashInt, direction, precision * BASE32_CHAR_BIT_LENGTH);
  return intToBase32(neighborHashInt, precision);
}

/**
 * Calculates neighbor's Geohash integer.
 * @param hashInt Geohash integer whose neighbor should be found.
 * @param direction Specifies which neighbor should be found (e.g. northern, southwestern, etc.)
 * @param bitDepth Defines precision of encoding.
 * The bigger the value, the smaller the encoded cell.
 * Can be either even or odd. Must be between 1 and 52.
 * @returns Neighbor's Geohash integer.
 */
export function getNeighborInt(
  hashInt: number,
  direction: Direction,
  bitDepth: number = MAX_BIT_DEPTH,
) {
  assertBitDepthIsValid(bitDepth);

  const [latMultiplier, lngMultiplier] = mapDirectionToMultipliers(direction);
  return translateCell(hashInt, { lat: latMultiplier, lng: lngMultiplier }, bitDepth);
}

export function translateCell(
  hashInt: number,
  translation: { lat: number; lng: number },
  bitDepth: number,
) {
  const { lat, lng, error } = decodeInt(hashInt, bitDepth);
  return encodeInt(
    lat + translation.lat * error.lat * 2,
    lng + translation.lng * error.lng * 2,
    bitDepth,
  );
}

export function mapDirectionToMultipliers(direction: Direction) {
  let [latMultiplier, lngMultiplier] = [0, 0];

  switch (direction) {
    case Direction.West:
      lngMultiplier = -1;
      break;

    case Direction.NorthWest:
      latMultiplier = 1;
      lngMultiplier = -1;
      break;

    case Direction.North:
      latMultiplier = 1;
      break;

    case Direction.NorthEast:
      latMultiplier = 1;
      lngMultiplier = 1;
      break;

    case Direction.East:
      lngMultiplier = 1;
      break;

    case Direction.SouthEast:
      latMultiplier = -1;
      lngMultiplier = 1;
      break;

    case Direction.South:
      latMultiplier = -1;
      break;

    case Direction.SouthWest:
      latMultiplier = -1;
      lngMultiplier = -1;
      break;
  }

  return [latMultiplier, lngMultiplier];
}
