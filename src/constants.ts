export const BASE32_HASH_MIN_LENGTH = 1;
export const BASE32_HASH_MAX_LENGTH = 9;

export const MIN_BIT_DEPTH = 1;
export const MAX_BIT_DEPTH = 52;

export const BASE32_BITS_PER_CHAR = 5;

export const LATITUDE_MAX_VALUE = 90;
export const LONGITUDE_MAX_VALUE = 180;

export const BASE32_DIGITS = Array.from('0123456789bcdefghjkmnpqrstuvwxyz');
export const BASE32_DIGITS_MAP = new Map(BASE32_DIGITS.map((digit, i) => [digit, i]));
