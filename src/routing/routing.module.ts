import { Module, HttpModule} from '@nestjs/common';
import { RoutingController } from './routing.controller';
import { RoutingService } from './routing.service';
import { WinnerEntity } from '../model/winner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [ HttpModule, TypeOrmModule.forFeature([ WinnerEntity ])],
    controllers: [ RoutingController ],
    providers: [ RoutingService ]
})
export class RoutingModule {}
