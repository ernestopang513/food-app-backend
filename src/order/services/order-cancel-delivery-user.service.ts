import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { FoodStandDish } from "src/food-stand-dish/entities/food-stand-dish.entity";
import { OrdersSocketGateway } from "src/ordersSocket/ordersSocket.gateway";
import { DataSource } from "typeorm";
import { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums/order-status.enum";




@Injectable()
export class OrderCancelDeliveryUser {

    private readonly logger = new Logger('CancelOrderDeliveryUser');

    constructor(
        private readonly dataSource: DataSource,

        private readonly orderGateway: OrdersSocketGateway,
    ){}


    async cancelOrderDeliveryUser(id: string ) {
    
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
          
          const order = await queryRunner.manager.findOne(Order, {
            where: {id: id},
            relations: ['orderDish', 'orderDish.dish', 'user', 'deliveryPoint']
          } )
          
          if (!order) {
            throw new NotFoundException(`Orden con id ${id} no encontrada.`);
          }
          
          for (const orderDish of order.orderDish) {
            const fsDish = await queryRunner.manager.findOne(FoodStandDish, {
              where: {
                dish: {id: orderDish.dish.id}
              }
            });
    
            if (fsDish) {
              fsDish.quantity += orderDish.quantity;
              await queryRunner.manager.save(fsDish);
            }
          }
            order.status = OrderStatus.CANCELADO;
            await queryRunner.manager.save(order);
            
            
            await queryRunner.commitTransaction();
            this.orderGateway.emitOrderUpdate({
                deliveryPointId: order.deliveryPoint.id,
                orderId: order.id,
                foodStandId: order.foodStandId
            })
            
            this.logger.log(`Orden ${order.id} cancelada correctamente.`);
            return  {message: 'Orden cancelada correctamente'};
    
        } catch (error) {
    
          await queryRunner.rollbackTransaction();
          this.logger.error('Error al cancelar la orden:', error);
          throw new InternalServerErrorException('No se pudo cancelar la orden.');
    
        } finally {
          await queryRunner.release();
        }
    }
    


}