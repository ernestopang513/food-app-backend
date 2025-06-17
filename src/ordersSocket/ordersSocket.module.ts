import { Module } from '@nestjs/common';
import { OrdersSocketService } from './ordersSocket.service';
import { OrdersSocketGateway } from './ordersSocket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [OrdersSocketGateway, OrdersSocketService],
  imports: [AuthModule],
  exports: [OrdersSocketGateway]
  
})
export class OrdersSocketModule {}
