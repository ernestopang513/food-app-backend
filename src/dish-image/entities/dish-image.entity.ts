import { Dish } from "src/dish/entities/dish.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class DishImage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'string',
        nullable: false,
    })
    url_image: string;

    @ManyToOne(
        () => Dish,
        (dish) => dish.images,
        {onDelete: 'CASCADE', eager: true}
    )
    dish: Dish;
}
