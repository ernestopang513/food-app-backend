import { FoodStandDish } from "src/food-stand-dish/entities/food-stand-dish.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";




@Entity()
export class Dish {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int', {
        default: 0,
    })
    price: number;

    @Column('text', {
        unique: true
    })
    name: string;

    @Column('text')
    description: string;


    @OneToMany(
        () => FoodStandDish,
        (foodStandDish) => foodStandDish.dish,
        {cascade: true}
    )
    foodStandDishes: FoodStandDish[];
}
