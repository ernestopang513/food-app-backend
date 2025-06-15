import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDish } from './entities/order-dish.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrderCreationService } from './services/order-creation.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService, 
    OrderCreationService
  ],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDish,
      User,
    ]),
    AuthModule
  ]
})
export class OrderModule {}
