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

@Injectable()
export class OrderService {

  private readonly logger = new Logger('OrderService')

  constructor (

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,

  ) {}



  async create(createOrderDto: CreateOrderDto) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userId, deliveryPoint: deliveryPointId, foodStandId } = createOrderDto;

      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      const deliveryPoint = await queryRunner.manager.findOne(DeliveryPoint, {
        where: { id: deliveryPointId },
      });
      if (!deliveryPoint) throw new BadRequestException('Delivery Point not found');

      const foodStand = await queryRunner.manager.findOne(FoodStand, {
        where: {id: foodStandId}
      })

      if (!foodStand || !foodStand.isOpen) throw new BadRequestException('Food Stand not found.');

      if(!foodStand.latitude || !foodStand.longitude || !deliveryPoint.latitude || !deliveryPoint.longitude) {
        throw new BadRequestException('Faltan coordenadas para calcular el tiempo estimado.')
      }

      const distanceKm = haversineDistance(
        foodStand.latitude,
        foodStand.longitude,
        deliveryPoint.latitude,
        deliveryPoint.longitude
      );

      const estimatedTimeMinutes = estimateBicycleTimeMinutes(distanceKm)

      const dishIds = createOrderDto.items.map(item => item.dishId);

      const foodStandDishes = await queryRunner.manager.find(FoodStandDish, {
        where: {
          foodStand: { id: foodStandId },
          dish: In(dishIds),
        },
        relations: ['dish'],
      });


      if (foodStandDishes.length !== dishIds.length) {
        throw new BadRequestException('Uno o más platillos no existen o no pertenecen al puesto solicitado');
      }

      const fsDishMap = new Map<string, FoodStandDish>(
        foodStandDishes.map(fsd => [fsd.dish.id, fsd])
      );

      let total_price = 0;

      const orderItems = createOrderDto.items.map(item => {
        const fsd = fsDishMap.get(item.dishId);
        if (!fsd) {
          throw new BadRequestException(`Platillo con ID ${item.dishId} no está disponible en este puesto`);
        }

        if (!fsd.is_active) {
          throw new BadRequestException(`Platillo ${fsd.dish.name} está inactivo`);
        }

        if (fsd.quantity === 0) {
          throw new BadRequestException(`Platillo ${fsd.dish.name} no tiene stock disponible`);
        }

        if (item.quantity > fsd.quantity) {
          throw new BadRequestException(
            `Cantidad solicitada (${item.quantity}) supera el stock disponible (${fsd.quantity}) para ${fsd.dish.name}`
          );
        }

        const subtotal = fsd.dish.price * item.quantity;
        total_price += subtotal;

        return {
          quantity: item.quantity,
          subtotal,
          dish: fsd.dish,
          fsDish: fsd,
        };
      });

      const order = queryRunner.manager.create(Order, {
        totalPrice: total_price,
        paymentMethod: createOrderDto.paymentMethod,
        deliveryPoint,
        user,
        estimatedTimeMinutes,
        foodStandId: foodStand.id
      });

      await queryRunner.manager.save(order);

      for (const item of orderItems) {
        const orderDish = queryRunner.manager.create(OrderDish, {
          quantity: item.quantity,
          subtotal: item.subtotal,
          dish: item.dish,
          order,
        });
        await queryRunner.manager.save(orderDish);

        item.fsDish.quantity -= item.quantity;
        await queryRunner.manager.save(item.fsDish);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`Orden ${order.id} creada correctamente`);
      return order;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error);
      throw new InternalServerErrorException('No se pudo crear la orden.');
    } finally {
      await queryRunner.release();
    }

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

  async assignDeliveryUser(id: string, assingDeliveryDto: AssignDeliveryDto) {

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['deliveryUser' ]
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


