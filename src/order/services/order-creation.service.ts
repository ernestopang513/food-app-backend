import { DataSource, In } from "typeorm";
import { CreateOrderDto } from "../dto/create-order.dto";
import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "src/auth/entities/user.entity";
import { haversineDistance, estimateBicycleTimeMinutes } from "src/common/utils/distance.util";
import { DeliveryPoint } from "src/delivery-point/entities/delivery-point.entity";
import { FoodStandDish } from "src/food-stand-dish/entities/food-stand-dish.entity";
import { FoodStand } from "src/food-stands/entities/food-stand.entity";
import { OrderDish } from "../entities/order-dish.entity";
import { Order } from "../entities/order.entity";





export class OrderCreationService {

    private readonly logger = new Logger('OrderService')

    constructor(
        
        private readonly dataSource: DataSource,
        
    ){}

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
}