import { describe, expect, test } from '@jest/globals';

import {
  encodeBboxBase32,
  decodeBboxBase32,
  encodeBboxInt,
  decodeBboxInt,
  getHashesWithinBboxBase32,
  getHashesWithinBboxInt,
} from '../src';
import { compare } from '../src/helpers';

import { givenHash } from './helpers';

describe('boxes module', () => {
  test('decodes bbox from int hash with even depth', () => {
    const [hashInt, bitDepth] = givenHash('11000111111010111000110000111110');
    const [expectedMinLat, expectedMinLng] = [40.1824951171875, 44.5111083984375];
    const [expectedMaxLat, expectedMaxLng] = [40.18524169921875, 44.5166015625];

    const box = decodeBboxInt(hashInt, bitDepth);

    expect(box.minLat).toBe(expectedMinLat);
    expect(box.minLng).toBe(expectedMinLng);
    expect(box.maxLat).toBe(expectedMaxLat);
    expect(box.maxLng).toBe(expectedMaxLng);
  });

  test('decodes bbox from int hash with odd depth', () => {
    const [hashInt, bitDepth] = givenHash('1100011111101011100011000011111');
    const [expectedMinLat, expectedMinLng] = [40.1824951171875, 44.5111083984375];
    const [expectedMaxLat, expectedMaxLng] = [40.18798828125, 44.5166015625];

    const box = decodeBboxInt(hashInt, bitDepth);

    expect(box.minLat).toBe(expectedMinLat);
    expect(box.minLng).toBe(expectedMinLng);
    expect(box.maxLat).toBe(expectedMaxLat);
    expect(box.maxLng).toBe(expectedMaxLng);
  });

  test('throws error due to invalid bit depth when decoding bbox', () => {
    const [hashInt] = givenHash('1100011111101011100011000011111');
    const tooSmallBitDepth = 0;
    const tooBigBitDepth = 53;

    expect(() => decodeBboxInt(hashInt, tooSmallBitDepth)).toThrow(RangeError);
    expect(() => decodeBboxInt(hashInt, tooBigBitDepth)).toThrow(RangeError);
  });

  test('encodes bbox and returns int hash with odd depth', () => {
    const [minLat, minLng] = [40.18310749942694, 44.51227395945389];
    const [maxLat, maxLng] = [40.18729483721813, 44.51623995096614];
    const [expectedHashInt, expectedBitDepth] = givenHash('1100011111101011100011000011111');

    const bboxIntObj = encodeBboxInt(minLat, minLng, maxLat, maxLng);

    expect(bboxIntObj).toBeTruthy();
    expect(bboxIntObj?.hashInt).toBe(expectedHashInt);
    expect(bboxIntObj?.bitDepth).toBe(expectedBitDepth);
  });

  test('decodes bbox from base-32 hash', () => {
    const hashBase32 = 'szpssgr';
    const [expectedMinLat, expectedMinLng] = [40.183868408203125, 44.515228271484375];
    const [expectedMaxLat, expectedMaxLng] = [40.18524169921875, 44.5166015625];

    const box = decodeBboxBase32(hashBase32);

    expect(box.minLat).toBe(expectedMinLat);
    expect(box.minLng).toBe(expectedMinLng);
    expect(box.maxLat).toBe(expectedMaxLat);
    expect(box.maxLng).toBe(expectedMaxLng);
  });

  test('encodes bbox with exact edge coordinates to base-32 hash', () => {
    const [minLat, minLng] = [40.183868408203125, 44.515228271484375];
    const [maxLat, maxLng] = [40.18524169921875, 44.5166015625];
    const expectedHashBase32 = 'szpssgr';

    const hashBase32 = encodeBboxBase32(minLat, minLng, maxLat, maxLng);

    expect(hashBase32).toBe(expectedHashBase32);
  });

  test('encodes bbox to base-32 hash', () => {
    const [minLat, minLng] = [40.18386841820312, 44.51522837148437];
    const [maxLat, maxLng] = [40.18524168921875, 44.5166014625];
    const expectedHashBase32 = 'szpssgr';

    const hashBase32 = encodeBboxBase32(minLat, minLng, maxLat, maxLng);

    expect(hashBase32).toBe(expectedHashBase32);
  });

  test('returns null because bbox occupies both eastern and western hemispheres', () => {
    const [minLat, minLng] = [40.18386841820312, -104.51522837148437];
    const [maxLat, maxLng] = [40.18524168921875, 120.5166014625];

    const hashInt = encodeBboxInt(minLat, minLng, maxLat, maxLng);
    const hashBase32 = encodeBboxBase32(minLat, minLng, maxLat, maxLng);

    expect(hashInt).toBe(null);
    expect(hashBase32).toBe(null);
  });

  test('throws error because of invalid coordinates', () => {
    const [minLat, minLng] = [40.18386841820312, 44.51522837148437];
    const [maxLat, maxLng] = [40.18524168921875, 44.5166014625];
    const [tooSmallLat, toSmallLng] = [-91, -181];
    const [tooBigLat, tooBigLng] = [91, 181];

    expect(() => encodeBboxBase32(tooSmallLat, minLng, maxLat, maxLng)).toThrow(RangeError);
    expect(() => encodeBboxBase32(minLat, toSmallLng, maxLat, maxLng)).toThrow(RangeError);
    expect(() => encodeBboxBase32(minLat, minLng, tooBigLat, maxLng)).toThrow(RangeError);
    expect(() => encodeBboxBase32(minLat, minLng, maxLat, tooBigLng)).toThrow(RangeError);
  });

  test('calculates all int hashes within a bbox', () => {
    const [minLat, minLng] = [40.17520776009799, 44.50734670780776];
    const [maxLat, maxLng] = [40.18798176349887, 44.51627726366204];
    const bitDepth = 32;
    const expectedHashesInt = [
      3354102829, 3354102831, 3354102840, 3354102842, 3354102841, 3354102843, 3354102844,
      3354102846, 3354102845, 3354102847,
    ].sort(compare);

    const hashesInt = getHashesWithinBboxInt(minLat, minLng, maxLat, maxLng, bitDepth);

    expect(hashesInt.sort(compare)).toEqual(expectedHashesInt);
  });

  test('calculates all base-32 hashes within a bbox', () => {
    const [minLat, minLng] = [40.18320776009799, 44.51334670780776];
    const [maxLat, maxLng] = [40.18798176349887, 44.51627726366204];
    const precision = 7;
    const expectedHashesBase32 = [
      'szpssgj',
      'szpssgn',
      'szpssgp',
      'szpssgm',
      'szpssgq',
      'szpssgr',
      'szpssgt',
      'szpssgw',
      'szpssgx',
      'szpssgv',
      'szpssgy',
      'szpssgz',
    ].sort();

    const hashesBase32 = getHashesWithinBboxBase32(minLat, minLng, maxLat, maxLng, precision);

    expect(hashesBase32.sort()).toEqual(expectedHashesBase32);
  });
});
