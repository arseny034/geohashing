import { describe, expect, test } from '@jest/globals';
import { givenHash } from '../test/helpers';
import {
  decodeBoxBase32,
  decodeBoxInt,
  getHashesWithinBoxBase32,
  getHashesWithinBoxInt,
} from './boxes';
import { sort } from './helpers';

describe('boxes module', () => {
  test('decodes box from int hash with even depth', () => {
    const [hashInt, bitDepth] = givenHash('11000111111010111000110000111110');
    const [expectedMinLat, expectedMinLng] = [40.1824951171875, 44.5111083984375];
    const [expectedMaxLat, expectedMaxLng] = [40.18524169921875, 44.5166015625];

    const box = decodeBoxInt(hashInt, bitDepth);

    expect(box.minLat).toBe(expectedMinLat);
    expect(box.minLng).toBe(expectedMinLng);
    expect(box.maxLat).toBe(expectedMaxLat);
    expect(box.maxLng).toBe(expectedMaxLng);
  });

  test('decodes box from int hash with odd depth', () => {
    const [hashInt, bitDepth] = givenHash('1100011111101011100011000011111');
    const [expectedMinLat, expectedMinLng] = [40.1824951171875, 44.5111083984375];
    const [expectedMaxLat, expectedMaxLng] = [40.18798828125, 44.5166015625];

    const box = decodeBoxInt(hashInt, bitDepth);

    expect(box.minLat).toBe(expectedMinLat);
    expect(box.minLng).toBe(expectedMinLng);
    expect(box.maxLat).toBe(expectedMaxLat);
    expect(box.maxLng).toBe(expectedMaxLng);
  });

  test('throws error due to invalid bit depth when decoding box', () => {
    const [hashInt] = givenHash('1100011111101011100011000011111');
    const tooSmallBitDepth = 0;
    const tooBigBitDepth = 53;

    expect(() => decodeBoxInt(hashInt, tooSmallBitDepth)).toThrow(RangeError);
    expect(() => decodeBoxInt(hashInt, tooBigBitDepth)).toThrow(RangeError);
  });

  test('decodes box from base-32 hash', () => {
    const hashBase32 = 'szpssgr';
    const [expectedMinLat, expectedMinLng] = [40.183868408203125, 44.515228271484375];
    const [expectedMaxLat, expectedMaxLng] = [40.18524169921875, 44.5166015625];

    const box = decodeBoxBase32(hashBase32);

    expect(box.minLat).toBe(expectedMinLat);
    expect(box.minLng).toBe(expectedMinLng);
    expect(box.maxLat).toBe(expectedMaxLat);
    expect(box.maxLng).toBe(expectedMaxLng);
  });

  test('calculates all int hashes within a box', () => {
    const [minLat, minLng] = [40.17520776009799, 44.50734670780776];
    const [maxLat, maxLng] = [40.18798176349887, 44.51627726366204];
    const bitDepth = 32;
    const expectedHashesInt = sort([
      3354102829, 3354102831, 3354102840, 3354102842, 3354102841, 3354102843, 3354102844,
      3354102846, 3354102845, 3354102847,
    ]);

    const hashesInt = getHashesWithinBoxInt(minLat, minLng, maxLat, maxLng, bitDepth);

    expect(sort(hashesInt)).toEqual(expectedHashesInt);
  });

  test('calculates all base-32 hashes within a box', () => {
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

    const hashesBase32 = getHashesWithinBoxBase32(minLat, minLng, maxLat, maxLng, precision);

    expect(hashesBase32.sort()).toEqual(expectedHashesBase32);
  });
});
