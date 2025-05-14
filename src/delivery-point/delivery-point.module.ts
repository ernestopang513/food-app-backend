import { Module } from '@nestjs/common';
import { DeliveryPointService } from './delivery-point.service';
import { DeliveryPointController } from './delivery-point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryPoint } from './entities/delivery-point.entity';

@Module({
  controllers: [DeliveryPointController],
  providers: [DeliveryPointService],
  imports: [
    TypeOrmModule.forFeature([
      DeliveryPoint
    ])
  ],
  exports: [DeliveryPointService]
})
export class DeliveryPointModule {}
