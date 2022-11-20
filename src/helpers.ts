import {
  BASE32_HASH_MAX_LENGTH,
  MAX_BIT_DEPTH,
  BASE32_HASH_MIN_LENGTH,
  MIN_BIT_DEPTH,
  LATITUDE_MAX_VALUE,
  LONGITUDE_MAX_VALUE,
  BASE32_DIGITS_MAP,
  BASE32_DIGITS,
} from './constants';

export function xor(a: unknown, b: unknown) {
  return Boolean(a ? !b : b);
}

export function sort(array: number[]) {
  return array.sort((a, b) => a - b);
}

export function assert<T, E extends Error>(
  expression: T,
  error: E | { new (): E },
): asserts expression {
  if (!expression) {
    throw typeof error === 'function' ? new error() : error;
  }
}

export function assertBase32HashLengthIsValid(length: number) {
  const [min, max] = [BASE32_HASH_MIN_LENGTH, BASE32_HASH_MAX_LENGTH];
  assert(
    length >= min && length <= max,
    new RangeError(`Number of chars must be between ${min} and ${max}`),
  );
}

export function assertBitDepthIsValid(bitDepth: number) {
  const [min, max] = [MIN_BIT_DEPTH, MAX_BIT_DEPTH];
  assert(
    bitDepth >= min && bitDepth <= max,
    new RangeError(`Bit depth must be between ${min} and ${max}`),
  );
}

export function assertLatitudeIsValid(lat: number) {
  const [min, max] = [-LATITUDE_MAX_VALUE, LATITUDE_MAX_VALUE];
  assert(lat >= min && lat <= max, new RangeError(`Latitude must be between ${min} and ${max}`));
}

export function assertLongitudeIsValid(lng: number) {
  const [min, max] = [-LONGITUDE_MAX_VALUE, LONGITUDE_MAX_VALUE];
  assert(lng >= min && lng <= max, new RangeError(`Longitude must be between ${min} and ${max}`));
}

export function assertLatLngIsValid(lat: number, lng: number) {
  assertLatitudeIsValid(lat);
  assertLongitudeIsValid(lng);
}

export function intToBase32(intValue: number, precision: number) {
  let hash = '';
  let prefix = intValue;

  for (let i = 0; i < precision; i++) {
    const code = prefix % 32;
    hash = BASE32_DIGITS[code] + hash;
    prefix = Math.floor(prefix / 32);
  }

  return hash;
}

export function base32ToInt(base32Value: string) {
  let value = 0;
  const digits = Array.from(base32Value).reverse();

  for (let i = 0; i < digits.length; i++) {
    const code = BASE32_DIGITS_MAP.get(digits[i]);

    if (code === undefined) {
      throw new RangeError(`Unknown digit: ${digits[i]}`);
    }

    value += code * 32 ** i;
  }

  return value;
}
