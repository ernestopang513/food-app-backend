import { Order } from "src/order/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class DeliveryPoint {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: false,
    })
    name: string;

    @Column({
        type: 'float',
        nullable: false
    })
    latitude: number;

    @Column({
        type: 'float',
        nullable: false
    })
    longitude: number;

    @Column({
        type: "bool",
        default: true,
    })
    is_active: boolean;

    @OneToMany(
        () => Order,
        (order) => order.deliveryPoint,
        {onDelete: 'CASCADE'}
    )
    order: Order[]
}
