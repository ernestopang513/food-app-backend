import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FoodStandsService } from '../food-stands/food-stands.service';
import { FoodStand } from 'src/food-stands/entities/food-stand.entity';
import { DishService } from 'src/dish/dish.service';
import { InitialData } from './data/seed-data';
import { Dish } from 'src/dish/entities/dish.entity';
import { FoodStandDishService } from 'src/food-stand-dish/food-stand-dish.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/entities/user.entity';
import { DeliveryPointService } from 'src/delivery-point/delivery-point.service';
import { DeliveryPoint } from 'src/delivery-point/entities/delivery-point.entity';

@Injectable()
export class SeedService {

  constructor (

    private readonly foodStandService: FoodStandsService,

    private readonly dishService: DishService,

    private readonly foodStandDishService: FoodStandDishService,

    private readonly authService: AuthService,

    private readonly deliveryPointService: DeliveryPointService,

  ){}
  
  async runSeed() {

    try {
      
      await this.insertNewFoodStand();
  
      await this.insertNewDishes();

      await this.insetAllNewFoodStandDish();

      await this.insertNewUsers();

      await this.insertNewDeliveryPoint();
  
      return 'SEED EXECUTED';

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error while executing seed')
    }

  }

  private async insertNewFoodStand () {

    try {

      await this.foodStandService.deleteAllFoodStands();
  
      const foodStands = InitialData.foodStands;
  
      const insertPromises: Promise<FoodStand>[] = [];
  
      foodStands.forEach(foodStand => {
        insertPromises.push(this.foodStandService.create(foodStand))
      })
  
      await Promise.all(insertPromises);
      
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed inserting food stands');
    }
  }

  private async insertNewDeliveryPoint () {

    try {

      await this.deliveryPointService.deleteAllDeliveryPoints();
  
      const deliveryPoints = InitialData.deliveryPoints;
  
      const insertPromises: Promise<DeliveryPoint>[] = [];
  
      deliveryPoints.forEach(deliveryPoint => {
        insertPromises.push(this.deliveryPointService.create(deliveryPoint))
      })
  
      await Promise.all(insertPromises);
      
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed inserting delivery points');
    }
  }

  private async insertNewUsers() {

    try {

      await this.authService.deleteAllUsers();

      const users = InitialData.users;

      const insertPromises: Promise<User>[] = [];

      users.forEach(user => {
        insertPromises.push(this.authService.createSeed(user))
      })

      await Promise.all(insertPromises);
      
      
    } catch (error) {

      console.log(error);
      throw new InternalServerErrorException('Failed inserting users');

    }
  }


  private async insertNewDishes() {


    try {
      
      await this.dishService.deleteAllDishes();
      const seedDishes = InitialData.dishes;
      const dishes: Promise<Dish>[] = [];
  
      seedDishes.forEach(dish => {
        dishes.push(this.dishService.create(dish));
      });
  
      await Promise.all(dishes);

    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Failed inserting dishes');

    }

  }

  private async insetAllNewFoodStandDish () {
    try {

      await this.foodStandDishService.deleteAllFoodStandDish();

      const foodstands = await this.foodStandService.findAll();
      const dishes = await this.dishService.findAll();


      const fdStandDishes = foodstands.map(fdStand => {
        dishes.map(dish => {
          this.foodStandDishService.create(fdStand.id, dish.id, {quantity: 30})
        })
        
      })

      await Promise.all(fdStandDishes)

      
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Fialded interting food stand dishes')
    }
  }

}
