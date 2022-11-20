import { describe, expect, test } from '@jest/globals';
import {
  getNeighborBase32,
  getNeighborInt,
  getNeighborsBase32,
  getNeighborsInt,
  mapDirectionToMultipliers,
} from './neighbors';
import { Direction } from './types';
import { givenHash } from './__tests__/helpers';

describe('neighbors module', () => {
  test('matches directions to multipliers properly', () => {
    const expectedMultipliers = [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ];

    const multipliers = Object.values(Direction).map(mapDirectionToMultipliers);

    expect(multipliers).toEqual(expectedMultipliers);
  });

  test("calculates neighbor's int hash", () => {
    const [hashInt, bitDepth] = givenHash('110001111110101110001100001111');
    const direction = Direction.South;
    const expectedNeighborHashInt = 838525710;

    const neighborHashInt = getNeighborInt(hashInt, direction, bitDepth);

    expect(neighborHashInt).toBe(expectedNeighborHashInt);
  });

  test("throws error due to invalid bit depth while calculating neighbor's hash", () => {
    const [hashInt] = givenHash('1100011111101011100011000011111');
    const direction = Direction.South;
    const tooSmallBitDepth = 0;
    const tooBigBitDepth = 53;

    expect(() => getNeighborInt(hashInt, direction, tooSmallBitDepth)).toThrow(RangeError);
    expect(() => getNeighborInt(hashInt, direction, tooBigBitDepth)).toThrow(RangeError);
  });

  test("calculates neighbor's base-32 hash", () => {
    const hashBase32 = 'ww8p1r4t8';
    const direction = Direction.East;
    const expectedNeighborHashBase32 = 'ww8p1r4t9';

    const neighborHash = getNeighborBase32(hashBase32, direction);

    expect(neighborHash).toBe(expectedNeighborHashBase32);
  });

  test("calculates all neighbors' int hashes", () => {
    const [hashInt, bitDepth] = givenHash('110001111110101110001100001111');
    const expectedNeighborHashesInt = [
      838525722, 838525744, 838525733, 838525732, 838525710, 838525708, 838525709, 838525720,
    ];

    const neighborHashesInt = getNeighborsInt(hashInt, bitDepth);

    expect(neighborHashesInt).toEqual(expectedNeighborHashesInt);
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
    const expectedNeighborHashesBase32 = [
      'szpssgw',
      'szpssgx',
      'szpssgr',
      'szpssgp',
      'szpssgn',
      'szpssgj',
      'szpssgm',
      'szpssgt',
    ];

    const neighborHashesBase32 = getNeighborsBase32(hashBase32);

    expect(neighborHashesBase32).toEqual(expectedNeighborHashesBase32);
  });
});
