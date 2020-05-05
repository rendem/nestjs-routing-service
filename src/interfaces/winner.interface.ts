import { Geometry } from 'geojson';

export interface Winner {
    name: string;
    delays: {[k: string]: any};
    remainedDistance: number;
    //point: Geometry;
}