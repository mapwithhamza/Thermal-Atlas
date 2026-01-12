export interface Coordinate {
    lat: number;
    lon: number;
}

export interface Temperature {
    value: number;
    lat: number;
    lon: number;
    unit: string;
}

export interface HeatIsland {
    id: string;
    severity: string;
    avgTemp: number;
    intensity: number;
}

export interface VegetationData {
    ndvi: number;
    coverage: number;
    location: Coordinate;
}
