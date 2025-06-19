import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDish } from './entities/order-dish.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrderCreationService } from './services/order-creation.service';
import { OrdersSocketModule } from 'src/ordersSocket/ordersSocket.module';
import { OrderCancelDeliveryUser } from './services/order-cancel-delivery-user.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService, 
    OrderCreationService,
    OrderCancelDeliveryUser
  ],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDish,
      User,
    ]),
    AuthModule,
    OrdersSocketModule
  ],
})
export class OrderModule {}
