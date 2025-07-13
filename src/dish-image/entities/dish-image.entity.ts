import { Dish } from "src/dish/entities/dish.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class DishImage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    url_image: string;

    @OneToOne(
        () => Dish,
        (dish) => dish.image,
    )
    dish: Dish;
}
