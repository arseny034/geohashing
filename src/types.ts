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

export type CoordinatesNDimensional = [number, number] | CoordinatesNDimensional[];

export interface Geometry<T extends string, C extends CoordinatesNDimensional> {
  type: T;
  coordinates: C;
}

export type GeoJsonGeometry =
  | Geometry<'Point', [number, number]>
  | Geometry<'LineString', [number, number][]>
  | Geometry<'Polygon', [number, number][][]>
  | Geometry<'MultiPoint', [number, number][]>
  | Geometry<'MultiLineString', [number, number][][]>
  | Geometry<'MultiPolygon', [number, number][][][]>;

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: GeoJsonGeometry | null;
  properties: Record<string, unknown> | null;
  bbox?: [number, number, number, number];
}
