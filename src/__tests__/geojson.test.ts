import { describe, expect, test } from '@jest/globals';

import {
  hashIntToPolygon,
  hashBase32ToPolygon,
  hashBase32ArrayToMultiPolygon,
  hashIntArrayToMultiPolygon,
} from '../index';
import { givenHash } from '../../test/helpers';

describe('geojson module', () => {
  test('creates geojson polygon from base-32 hash', () => {
    const hashBase32 = 'gbsuv';
    const expectedType = 'Feature';
    const expectedBbox = [-4.3505859375, 48.6474609375, -4.306640625, 48.69140625];
    const expectedGeometryType = 'Polygon';
    const expectedGeometryCoords = [
      [
        [-4.3505859375, 48.6474609375],
        [-4.306640625, 48.6474609375],
        [-4.306640625, 48.69140625],
        [-4.3505859375, 48.69140625],
        [-4.3505859375, 48.6474609375],
      ],
    ];
    const expectedProperties = {
      lat: 48.66943359375,
      lng: -4.32861328125,
      error: {
        lat: 0.02197265625,
        lng: 0.02197265625,
      },
    };

    const polygon = hashBase32ToPolygon(hashBase32);

    expect(polygon.type).toBe(expectedType);
    expect(polygon.bbox).toEqual(expectedBbox);
    expect(polygon.geometry?.type).toBe(expectedGeometryType);
    expect(polygon.geometry?.coordinates).toEqual(expectedGeometryCoords);
    expect(polygon.properties).toEqual(expectedProperties);
  });

  test('creates geojson polygon from odd int hash', () => {
    const [hashInt, bitDepth] = givenHash('1100011111101011100011000011111');
    const expectedType = 'Feature';
    const expectedBbox = [44.5111083984375, 40.1824951171875, 44.5166015625, 40.18798828125];
    const expectedGeometryType = 'Polygon';
    const expectedGeometryCoords = [
      [
        [44.5111083984375, 40.1824951171875],
        [44.5166015625, 40.1824951171875],
        [44.5166015625, 40.18798828125],
        [44.5111083984375, 40.18798828125],
        [44.5111083984375, 40.1824951171875],
      ],
    ];
    const expectedProperties = {
      lat: 40.18524169921875,
      lng: 44.51385498046875,
      error: {
        lat: 0.00274658203125,
        lng: 0.00274658203125,
      },
    };

    const polygon = hashIntToPolygon(hashInt, bitDepth);

    expect(polygon.type).toBe(expectedType);
    expect(polygon.bbox).toEqual(expectedBbox);
    expect(polygon.geometry?.type).toBe(expectedGeometryType);
    expect(polygon.geometry?.coordinates).toEqual(expectedGeometryCoords);
    expect(polygon.properties).toEqual(expectedProperties);
  });

  test('creates geojson multi-polygon from base-32 hashes', () => {
    const hashBase32Array = ['gbsvh', 'gbsus', 'gbsuy'];
    const expectedType = 'Feature';
    const expectedGeometryType = 'MultiPolygon';
    const expectedGeometryCoords = [
      [
        [
          [-4.39453125, 48.69140625],
          [-4.3505859375, 48.69140625],
          [-4.3505859375, 48.7353515625],
          [-4.39453125, 48.7353515625],
          [-4.39453125, 48.69140625],
        ],
      ],
      [
        [
          [-4.39453125, 48.603515625],
          [-4.3505859375, 48.603515625],
          [-4.3505859375, 48.6474609375],
          [-4.39453125, 48.6474609375],
          [-4.39453125, 48.603515625],
        ],
      ],
      [
        [
          [-4.306640625, 48.6474609375],
          [-4.2626953125, 48.6474609375],
          [-4.2626953125, 48.69140625],
          [-4.306640625, 48.69140625],
          [-4.306640625, 48.6474609375],
        ],
      ],
    ];

    const multiPolygon = hashBase32ArrayToMultiPolygon(hashBase32Array);

    expect(multiPolygon.type).toBe(expectedType);
    expect(multiPolygon.geometry?.type).toBe(expectedGeometryType);
    expect(multiPolygon.geometry?.coordinates).toEqual(expectedGeometryCoords);
  });

  test('creates geojson multi-polygon of different sizes from int hashes', () => {
    const hashIntArray = [
      givenHash('0111101010110001101110000'),
      givenHash('01111010101100011010110001'),
      givenHash('011110101011000110101111000'),
    ];
    const expectedType = 'Feature';
    const expectedGeometryType = 'MultiPolygon';
    const expectedGeometryCoords = [
      [
        [
          [-4.39453125, 48.69140625],
          [-4.3505859375, 48.69140625],
          [-4.3505859375, 48.7353515625],
          [-4.39453125, 48.7353515625],
          [-4.39453125, 48.69140625],
        ],
      ],
      [
        [
          [-4.39453125, 48.62548828125],
          [-4.3505859375, 48.62548828125],
          [-4.3505859375, 48.6474609375],
          [-4.39453125, 48.6474609375],
          [-4.39453125, 48.62548828125],
        ],
      ],
      [
        [
          [-4.306640625, 48.6474609375],
          [-4.28466796875, 48.6474609375],
          [-4.28466796875, 48.66943359375],
          [-4.306640625, 48.66943359375],
          [-4.306640625, 48.6474609375],
        ],
      ],
    ];

    const multiPolygon = hashIntArrayToMultiPolygon(hashIntArray);

    expect(multiPolygon.type).toBe(expectedType);
    expect(multiPolygon.geometry?.type).toBe(expectedGeometryType);
    expect(multiPolygon.geometry?.coordinates).toEqual(expectedGeometryCoords);
  });
});
