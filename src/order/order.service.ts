import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, In, Repository } from 'typeorm';
import { OrderDish } from './entities/order-dish.entity';
import { Dish } from 'src/dish/entities/dish.entity';

@Injectable()
export class OrderService {

  private readonly logger = new Logger('OrderService')

  constructor (

    private readonly dataSource: DataSource

  ) {}
  

  async create(createOrderDto: CreateOrderDto) {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      const dishIds = createOrderDto.items.map(item => item.dishId);
      const dishes = await queryRunner.manager.find(Dish, {
        where: {id: In(dishIds)}
      });

      // console.log('IDs recibidos del cliente:', dishIds);

      // console.log('Platos encontrados en DB:', dishes.map(d => d.id));

      if (dishes.length !== dishIds.length) {
        throw new BadRequestException('Uno o más platillos no existen');
      }
      //Previo total de la orden
      // const total_price = createOrderDto.items.reduce((sum, item) => sum + item.subtotal, 0)
      
      const dishMap = new Map(dishes.map(dish => [dish.id, dish.price]));

      let total_price = 0;
      const orderItems = createOrderDto.items.map(item => {
        const price = dishMap.get(item.dishId);
        if (price === undefined) {
          throw new BadRequestException(`Platillo con ID ${item.dishId} no existe`);
        }
        const subtotal = price * item.quantity;
        total_price += subtotal

        return {
          quantity: item.quantity,
          subtotal,
          dishId: item.dishId
        }

      });

      const order = queryRunner.manager.create(Order, {
        totalPrice: total_price,
        paymentMethod: createOrderDto.paymentMethod,
      });

      await queryRunner.manager.save(order);

      for (const item of orderItems) {

        const dishEntity = dishes.find(d=> d.id === item.dishId);

        if (!dishEntity) {
          throw new BadRequestException(`Platillo con ID ${item.dishId} no fue encontrado`)
        }

        const orderItem = queryRunner.manager.create(OrderDish, {
          quantity: item.quantity,
          subtotal: item.subtotal,
          order: order,
          dish: dishEntity
        });
        await queryRunner.manager.save(orderItem);
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





  // async create(createOrderDto: CreateOrderDto) {

  //   try {

  //     const order = this.orderRepository.create(createOrderDto);
  //     await this.orderRepository.save(order);

  //     return order;
      
  //   } catch (error) {
  //     this.handleDBExceptions(error);
  //   }
  // }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
