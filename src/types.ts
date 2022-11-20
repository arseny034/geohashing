export interface Coordinates {
  lat: number;
  lng: number;
  error: {
    lat: number;
    lng: number;
  };
}

export interface Box {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

export enum Direction {
  North = 'North',
  NorthEast = 'NorthEast',
  East = 'East',
  SouthEast = 'SouthEast',
  South = 'South',
  SouthWest = 'SouthWest',
  West = 'West',
  NorthWest = 'NorthWest',
}
