import { describe, expect, test } from '@jest/globals';

import {
  getNeighborBase32,
  getNeighborInt,
  getNeighborsBase32,
  getNeighborsInt,
} from '../neighbors';
import { givenHash } from '../../test/helpers';

describe('neighbors module', () => {
  test("calculates neighbor's int hash", () => {
    const [hashInt, bitDepth] = givenHash('110001111110101110001100001111');
    const direction = 'south';
    const expectedNeighborHashInt = 838525710;

    const neighborHashInt = getNeighborInt(hashInt, direction, bitDepth);

    expect(neighborHashInt).toBe(expectedNeighborHashInt);
  });

  test("throws error due to invalid bit depth while calculating neighbor's hash", () => {
    const [hashInt] = givenHash('1100011111101011100011000011111');
    const direction = 'south';
    const tooSmallBitDepth = 0;
    const tooBigBitDepth = 53;

    expect(() => getNeighborInt(hashInt, direction, tooSmallBitDepth)).toThrow(RangeError);
    expect(() => getNeighborInt(hashInt, direction, tooBigBitDepth)).toThrow(RangeError);
  });

  test("calculates neighbor's base-32 hash", () => {
    const hashBase32 = 'ww8p1r4t8';
    const direction = 'east';
    const expectedNeighborHashBase32 = 'ww8p1r4t9';

    const neighborHash = getNeighborBase32(hashBase32, direction);

    expect(neighborHash).toBe(expectedNeighborHashBase32);
  });

  test("calculates all neighbors' int hashes", () => {
    const [hashInt, bitDepth] = givenHash('110001111110101110001100001111');
    const expectedNeighborsInt = {
      north: 838525722,
      northEast: 838525744,
      east: 838525733,
      southEast: 838525732,
      south: 838525710,
      southWest: 838525708,
      west: 838525709,
      northWest: 838525720,
    };

    const neighborHashesInt = getNeighborsInt(hashInt, bitDepth);

    expect(neighborHashesInt).toEqual(expectedNeighborsInt);
  });

  test("throws error due to invalid bit depth while calculating neighbors' hashes", () => {
    const [hashInt] = givenHash('1100011111101011100011000011111');
    const tooSmallBitDepth = 0;
    const tooBigBitDepth = 53;

    expect(() => getNeighborsInt(hashInt, tooSmallBitDepth)).toThrow(RangeError);
    expect(() => getNeighborsInt(hashInt, tooBigBitDepth)).toThrow(RangeError);
  });

  test("calculates all neighbors' base-32 hashes", () => {
    const hashBase32 = 'szpssgq';
    const expectedNeighborsBase32 = {
      north: 'szpssgw',
      northEast: 'szpssgx',
      east: 'szpssgr',
      southEast: 'szpssgp',
      south: 'szpssgn',
      southWest: 'szpssgj',
      west: 'szpssgm',
      northWest: 'szpssgt',
    };

    const neighborHashesBase32 = getNeighborsBase32(hashBase32);

    expect(neighborHashesBase32).toEqual(expectedNeighborsBase32);
  });
});
