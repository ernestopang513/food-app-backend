import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDish } from './entities/order-dish.entity';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrderCreationService } from './services/order-creation.service';
import { OrdersSocketService } from 'src/ordersSocket/ordersSocket.service';
import { OrdersSocketModule } from 'src/ordersSocket/ordersSocket.module';
import { OrdersSocketGateway } from 'src/ordersSocket/ordersSocket.gateway';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService, 
    OrderCreationService,
    //
    // OrdersSocketGateway
    //
  ],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderDish,
      User,
    ]),
    AuthModule,
    //
    OrdersSocketModule
    //
  ],
})
export class OrderModule {}
