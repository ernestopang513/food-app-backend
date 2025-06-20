import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, In, Repository } from 'typeorm';
import { OrderDish } from './entities/order-dish.entity';
import { DeliveryPoint } from 'src/delivery-point/entities/delivery-point.entity';
import { User } from 'src/auth/entities/user.entity';
import { OrderStatus } from './enums/order-status.enum';
import { FoodStandDish } from 'src/food-stand-dish/entities/food-stand-dish.entity';
import { FoodStand } from 'src/food-stands/entities/food-stand.entity';
import { estimateBicycleTimeMinutes, haversineDistance } from 'src/common/utils/distance.util';
import { FilterOrderDto } from './dto/filter-orders.dto';
import { AssignDeliveryDto } from './dto/assingn-delivery-status.dto';
import { OrderCreationService } from './services/order-creation.service';
import { OrdersSocketService } from 'src/ordersSocket/ordersSocket.service';
import { OrdersSocketGateway } from '../ordersSocket/ordersSocket.gateway';
import { OrderCancelDeliveryUser } from './services/order-cancel-delivery-user.service';

@Injectable()
export class OrderService {

  private readonly logger = new Logger('OrderService')

  constructor (

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,
    
    private readonly orderCreationService: OrderCreationService,

    private readonly cancelOrderDeliveryUserService: OrderCancelDeliveryUser,

    private readonly ordersGateway: OrdersSocketGateway,

  ) {}



  async create(createOrderDto: CreateOrderDto) {

    return this.orderCreationService.create(createOrderDto);

  }


  findAll() {
    return this.orderRepository.find({});
  }

   async findAllWaitingOrders(filterDto: FilterOrderDto) {

    const {deliveryPointId, foodStandId} = filterDto


    const where: any = {
      status: OrderStatus.PENDIENTE,
      foodStandId
    }


    if (deliveryPointId) {
      where.deliveryPoint = {id: deliveryPointId};
    }
    const orders = await this.orderRepository.find({
      where,
      relations: ['deliveryPoint', 'user', 'deliveryUser', 'orderDish', 'orderDish.dish'],
      order: {
        createdAt: 'ASC'
      }
    });

     orders.forEach(order => {
       order.orderDish.sort((a, b) => {
         const nameA = a.dish.name.toLowerCase();
         const nameB = b.dish.name.toLowerCase();
         return nameA.localeCompare(nameB);
       });
     });

     if(deliveryPointId) {
      return orders;
     }
 
    //  const grouped = orders.reduce((acc, order) => {
    //    const pointId = order.deliveryPoint.id;

    //    if (!acc[pointId]) {
    //      acc[pointId] = {
    //        deliveryPoint: order.deliveryPoint,
    //        orders: [],
    //      };
    //    }

    //    acc[pointId].orders.push(order);
    //    return acc;
    //  }, {} as Record<string, { deliveryPoint: any; orders: typeof orders }>);

    //  return Object.values(grouped);

     const grouped = orders.reduce((acc, order) => {
       const pointId = order.deliveryPoint.id;

       if (!acc[pointId]) {
         acc[pointId] = {
           deliveryPoint: order.deliveryPoint,
           orders: 0,
         };
       }

       acc[pointId].orders += 1;
       return acc;
        }, {} as Record<string, { deliveryPoint: any; orders: number }>);

     return Object.values(grouped);


  }
  
  findAllCanceledOrders() {
    return this.orderRepository.find({
      where: {status: OrderStatus.CANCELADO},
      relations: ['deliveryPoint', 'user', 'deliveryUser']
    });
  }

  async findOne(id: string) {
    try {

      const order = await this.orderRepository.findOneBy({id});

      if ( !order ) {
        throw new NotFoundException(`Orden con id: ${id} no encontrada`)
      }

      return order;
      
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async assignAndUpdateOrderStatus(id: string, assingDeliveryDto: AssignDeliveryDto) {

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['deliveryUser', 'deliveryPoint' ]
    });
    if (!order ) throw new NotFoundException('Order not found.');

    // console.log(order.deliveryUser)
    
    const deliveryUser = await this.userRepository.findOne({ 
      where: {
        id: assingDeliveryDto.userId,
        isActive: true,
      }
    })
    
    // console.log(deliveryUser)

    if (!deliveryUser) throw new NotFoundException('Delivery user not found');

    if ( !order.deliveryUser ) {
      order.deliveryUser = deliveryUser;
    } 
    
    if ( order.deliveryUser.id !== deliveryUser.id) {
      console.log('no son el mismo repartidor')
      throw new BadRequestException('Solo el mismo repartidor puede cambiar status')
    }
    
    order.status = assingDeliveryDto.status || OrderStatus.EN_CAMINO ;

   this.ordersGateway.emitOrderUpdate({
    deliveryPointId: order.deliveryPoint.id,
    orderId: order.id,
    foodStandId: order.foodStandId,
   })


    return this.orderRepository.save(order);

  }

  //* Endpoint para ordenes por repartidor
  async deliveryUserOrders(deliveryUserId: string, filterDto: FilterOrderDto) {

    const { deliveryPointId, foodStandId } = filterDto;

    const where: any = {
      status: OrderStatus.EN_CAMINO,
      foodStandId,
      deliveryUser: {id: deliveryUserId }
    }

    if(deliveryPointId) {
      where.deliveryPoint = {id: deliveryPointId};
    }

    const orders = await this.orderRepository.find({
      where,
      relations: [ 'deliveryPoint', 'user', 'deliveryUser', 'orderDish', 'orderDish.dish'],
      order: {
        createdAt: 'ASC'
      }
    })

    orders.forEach(order => {
       order.orderDish.sort((a, b) => {
         const nameA = a.dish.name.toLowerCase();
         const nameB = b.dish.name.toLowerCase();
         return nameA.localeCompare(nameB);
       });
     });

     if(deliveryPointId) {
      return orders;
     }

     const grouped = orders.reduce((acc, order) => {
       const pointId = order.deliveryPoint.id;

       if (!acc[pointId]) {
         acc[pointId] = {
           deliveryPoint: order.deliveryPoint,
           orders: 0,
         };
       }

       acc[pointId].orders += 1;
       return acc;
        }, {} as Record<string, { deliveryPoint: any; orders: number }>);

     return Object.values(grouped);


  }
  
  async userOrders(userId: string) {
    return this.orderRepository.find({
      where: {
        user: { id: userId },
        status: OrderStatus.PENDIENTE
      },
    });
  }

  async cancelOrderDeliveryUser(id: string) {
    return this.cancelOrderDeliveryUserService.cancelOrderDeliveryUser(id);
  }

  async cancelOrder(id: string , updateOrderDto: UpdateOrderDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const order = await queryRunner.manager.findOne(Order, {
        where: {id: id},
        relations: ['orderDish', 'orderDish.dish', 'user']
      } )
      
      if (!order) {
        throw new NotFoundException(`Orden con id ${id} no encontrada.`);
      }
      
      if ( order.user.id !== updateOrderDto.userId ) {
        throw new BadRequestException(`Acción no permitida`);
      }

      if (order.status !== OrderStatus.PENDIENTE) {
        throw new BadRequestException('Solo se pueden cancelar órdenes en estado Pendiente')
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


  async remove(id: string) {

    const order = await this.findOne(id);

    await this.orderRepository.remove(order);

  }


  async deleteAllOrders () {
    const query = this.orderRepository.createQueryBuilder('order');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error)
    }

  }


  private handleDBExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    this.logger.log(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}


