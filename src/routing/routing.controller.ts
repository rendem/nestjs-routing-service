import { Controller, Get, Post, Req, Body, HttpCode, Res} from '@nestjs/common';
import { Response, Request} from 'express';
import { RoutingService } from './routing.service';
import { Crud } from '@nestjsx/crud';
import { WinnerEntity } from '../model/winner.entity';

@Crud({
    model : {
        type: WinnerEntity
    }
})

@Controller('routing')
export class RoutingController {
    constructor(private service:RoutingService) { }

    @Get()
    getAll() {
        return this.service.getAll();
    }

    @Post('api')
    selectWinner(@Req() req: Request, @Res() res: Response) {
        return this.service.selectWinner(req, res)
    }
}
