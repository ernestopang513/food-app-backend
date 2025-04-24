import { Dish } from "src/dish/entities/dish.entity";
import { FoodStand } from "src/food-stands/entities/food-stand.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";



@Entity()
@Unique(['foodStand', 'dish'])
export class FoodStandDish {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int' , {
        default: 0
    })
    quantity: number;

    @Column({
        type: "bool",
        default: true
    })
    is_active: boolean;

    @ManyToOne(
        () => FoodStand,
        ( foodStand ) => foodStand.foodStandDishes,
        {onDelete: 'CASCADE'}
    )
    foodStand: FoodStand;

    @ManyToOne(
        () => Dish,
        (dish) => dish.foodStandDishes,
        {onDelete: 'CASCADE'}
    )
    dish: Dish
}
