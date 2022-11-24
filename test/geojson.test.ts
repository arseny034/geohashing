import { describe, expect, test } from '@jest/globals';

import { hashIntToRectangle, hashBase32ToRectangle } from '../src';

import { givenHash } from './helpers';

describe('geojson module', () => {
  test('creates geojson rectangle from base-32 hash', () => {
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

    const rectangle = hashBase32ToRectangle(hashBase32);

    expect(rectangle.type).toBe(expectedType);
    expect(rectangle.bbox).toEqual(expectedBbox);
    expect(rectangle.geometry.type).toBe(expectedGeometryType);
    expect(rectangle.geometry.coordinates).toEqual(expectedGeometryCoords);
    expect(rectangle.properties).toEqual(expectedProperties);
  });

  test('creates geojson rectangle from odd int hash', () => {
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

    const rectangle = hashIntToRectangle(hashInt, bitDepth);

    expect(rectangle.type).toBe(expectedType);
    expect(rectangle.bbox).toEqual(expectedBbox);
    expect(rectangle.geometry.type).toBe(expectedGeometryType);
    expect(rectangle.geometry.coordinates).toEqual(expectedGeometryCoords);
    expect(rectangle.properties).toEqual(expectedProperties);
  });
});
