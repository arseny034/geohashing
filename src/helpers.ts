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

export function compare(a: number, b: number) {
  return a - b;
}

export function assertBase32HashLengthIsValid(length: number) {
  const [min, max] = [BASE32_HASH_MIN_LENGTH, BASE32_HASH_MAX_LENGTH];
  if (length < min || length > max) {
    throw new RangeError(`Number of chars must be between ${min} and ${max}`);
  }
}

export function assertBitDepthIsValid(bitDepth: number) {
  const [min, max] = [MIN_BIT_DEPTH, MAX_BIT_DEPTH];
  if (bitDepth < min || bitDepth > max) {
    throw new RangeError(`Bit depth must be between ${min} and ${max}`);
  }
}

export function assertLatitudeIsValid(lat: number) {
  const [min, max] = [-LATITUDE_MAX_VALUE, LATITUDE_MAX_VALUE];
  if (lat < min || lat > max) {
    throw new RangeError(`Latitude must be between ${min} and ${max}`);
  }
}

export function assertLongitudeIsValid(lng: number) {
  const [min, max] = [-LONGITUDE_MAX_VALUE, LONGITUDE_MAX_VALUE];
  if (lng < min || lng > max) {
    throw new RangeError(`Longitude must be between ${min} and ${max}`);
  }
}

export function assertLatLngIsValid(lat: number, lng: number) {
  assertLatitudeIsValid(lat);
  assertLongitudeIsValid(lng);
}

export function intToBase32(intValue: number, length: number) {
  let hash = '';
  let prefix = intValue;

  for (let i = 0; i < length; i++) {
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
