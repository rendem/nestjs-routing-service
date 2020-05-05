import { Injectable, Res, Req, HttpService} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response, Request } from 'express';
import { WinnerEntity } from '../model/winner.entity';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Winner} from '../interfaces/winner.interface';
import { Point } from '../interfaces/point.interface';
import { map } from 'rxjs/operators';
import { OSRM_DRIVING_ROUTE_SERVICE } from './constants';

@Injectable()
export class RoutingService extends TypeOrmCrudService<WinnerEntity>{

    constructor(@InjectRepository(WinnerEntity)
        public readonly repo: Repository<WinnerEntity>, private http: HttpService) {
            super(repo);
    }

    async getAll() {
        return this.repo.find();
    }

    async selectWinner(@Req() req: Request, @Res() res: Response) {
        if(this.isSecretPwValid(req.headers['x-secret'] as string)) {
           let winner = await this.getWinner(req.body)
            //let winnerEntity = new WinnerEntity();
            //winnerEntity.name = winner.name;
            //winnerEntity.point = winner.point;
            //let DBresponse = await this.repo.save(winnerEntity);
            if(winner){
                return res.status(200).json(winner);
            } else {
                return res.status(400).json('oops Winner couldn\'t populated with given data!');
            }

        }
        return res.status(401).json({ message : "oops Bad Request with invalid token!"});
    }

    async getWinner(body: object) {
        let winner: Winner = {
            name: '',
            delays: new Object(),
            remainedDistance: -1
        };
        let time = body['time'];
        let points: object[] = [];

        await Promise.all(body['waypoints'].map(async (waypoint) => {
            let point: Point = {
                name: undefined,
                speed: undefined,
                remainedDistance: undefined
                };
            point.name = waypoint.name;
            let route  =
                await this.fetchRoutes(
                    this.getValuesFromObj(body['origin']),
                    this.getValuesFromObj(waypoint),
                    this.getValuesFromObj(body['destination'])
                    );
            point.speed = route[0]['distance'] / route[0]['duration'];
            point.remainedDistance = route[0]['distance'] - (point.speed * time);

            if(winner.remainedDistance == -1 || winner.remainedDistance > point.remainedDistance){
                winner.name = point.name;
                winner.remainedDistance = point.remainedDistance;
                //winner.point = waypoint;
            }
            points.push(point);
        }));

        await Promise.all(points.map(point => {
            let catchUpTime = (point['remainedDistance'] - winner.remainedDistance) / point['speed'];
            // returning 3 decimals for delays
            winner.delays[point['name']] =  Math.round(catchUpTime * 1000)/1000;
        }));
        delete winner.remainedDistance;
        return winner;
    }

    async fetchRoutes(origin, point, destination) {
        const url = OSRM_DRIVING_ROUTE_SERVICE+`${origin};${point};${destination}?overview=false`;
         return await this.http.get(url)
            .toPromise()
            .then(res => res.data['routes'])
            .catch(err => console.log(err));
    }

    getValuesFromObj(obj: object) {
        if(obj['name']) delete obj['name'];
        return Object.keys(obj).sort().reverse().map(key => obj[key]);
    }

    isSecretPwValid(secretPw: string) :boolean {
        return secretPw == 'Mileus' ? true : false;
    }

}
