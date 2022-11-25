export interface Coordinates {
  lat: number;
  lng: number;
  error: {
    lat: number;
    lng: number;
  };
}

export interface Bbox {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

export enum Direction {
  North = 'north',
  NorthEast = 'northEast',
  East = 'east',
  SouthEast = 'southEast',
  South = 'south',
  SouthWest = 'southWest',
  West = 'west',
  NorthWest = 'northWest',
}

export type Neighbors<T extends number | string> = Record<`${Direction}`, T>;

export type GeoJsonGeometryPolygon = {
  type: 'Polygon';
  coordinates: [number, number][][];
};

export type GeoJsonGeometryMultiPolygon = {
  type: 'MultiPolygon';
  coordinates: [number, number][][][];
};

export type GeoJsonGeometry = GeoJsonGeometryPolygon | GeoJsonGeometryMultiPolygon;

export interface GeoJsonFeature<T extends GeoJsonGeometry | null = null> {
  type: 'Feature';
  geometry: T;
  properties: Record<string, unknown> | null;
  bbox?: [number, number, number, number];
}
