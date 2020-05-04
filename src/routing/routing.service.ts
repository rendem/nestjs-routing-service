import { Injectable, Res, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response, Request } from 'express';
import { WinnerEntity } from '../model/winner.entity';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Winner} from '../interfaces/winner.interface';
import { OSRM } from 'osrm';

@Injectable()
export class RoutingService extends TypeOrmCrudService<WinnerEntity>{

    constructor(@InjectRepository(WinnerEntity)
        public readonly repo: Repository<WinnerEntity>) {
        super(repo);
    }

    async getAll() {
        return this.repo.find();
    }

    async selectWinner(@Req() req: Request, @Res() res: Response) {
        //var osrm = require('osrm');
        if(this.isSecretPwValid(req.headers['x-secret'] as string)) {
         console.log(req.body);
            let winner = new WinnerEntity();
            let body = req.body;
            winner.name = body.name;

            let response = await this.repo.save(winner);

            return res.status(200).json(JSON.stringify(winner));
        }


        return res.status(400).json({ message : "oops Bad Request!"});
    }

    

    isSecretPwValid(secret: string) :boolean {
        return secret == 'Mileus' ? true : false;
    }



}
