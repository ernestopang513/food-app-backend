import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDish } from './entities/order-dish.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDish,
      User,
    ])
  ]
})
export class OrderModule {}
