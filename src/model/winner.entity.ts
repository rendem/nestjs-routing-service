import { Entity, PrimaryGeneratedColumn, Generated, Column} from 'typeorm';
import { Geometry } from 'geojson';

@Entity()
export class WinnerEntity {

    @PrimaryGeneratedColumn('uuid')
    @Generated('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column({
        type: 'geometry',
        nullable: true,
        spatialFeatureType: 'Point',
        srid: 4326
        })
    point: Geometry;

}
