export interface Coordinates {
  lat: number;
  lng: number;
  error: {
    lat: number;
    lng: number;
  };
}

export interface HashInt {
  hashInt: number;
  bitDepth: number;
}

export interface Bbox {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

export type Direction =
  | 'north'
  | 'northEast'
  | 'east'
  | 'southEast'
  | 'south'
  | 'southWest'
  | 'west'
  | 'northWest';

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
