import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderPaymentMethod } from "../enums/order-payment-method.enum";
import { OrderDish } from "./order-dish.entity";
import { DeliveryPoint } from "src/delivery-point/entities/delivery-point.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity()
export class Order {

    @ApiProperty({
            example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959',
            description: 'Order ID',
            uniqueItems: true
        })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 165,
        description: 'Precio total de la orden',
        required: true,
        nullable: false
    })
    @Column('int',{
        nullable: false,
    })
    totalPrice: number;

    @ApiProperty({
        enum: OrderStatus,
        enumName: 'OrderStatus',
        example: OrderStatus.PENDIENTE,
        description: 'Estado de la orden',
    })
    @Column({
        type: 'enum',
        enum: OrderStatus,
        nullable: false,
        default: OrderStatus.PENDIENTE,
    })
    status: OrderStatus;

    @ApiProperty({
        enum: OrderPaymentMethod,
        enumName: 'OrderPaymentMethod',
        example: OrderPaymentMethod.EFECTIVO,
        description: 'Método de pago',
    })
    @Column({
        type: 'enum',
        enum: OrderPaymentMethod,
        nullable: false,
        default: OrderPaymentMethod.EFECTIVO,
    })
    paymentMethod: OrderPaymentMethod;

    @ApiProperty({
        example: 25,
        description: 'Tiempo estimado de entrega en minutos',
    })
    @Column('int', {
        default: 0,
    })
    estimatedTimeMinutes: number;

    @ApiProperty({
        example: '2025-05-16T12:34:56Z',
        description: 'Fecha de creación',
    })
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;


     @ApiProperty({
            example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959',
            description: 'FoodStand ID'
        })
    @Column('uuid', {
        nullable: false
    })
    foodStandId: string;


    @OneToMany(
        () => OrderDish,
        (orderDish) => orderDish.order,
        {cascade: true, eager: false} 
    )
    orderDish: OrderDish[];

    @ApiProperty({
        type: () => DeliveryPoint,
        description: 'Punto de entrega asociado a la orden',
    })
    @ManyToOne(
        () => DeliveryPoint,
        (deliveryPoint) => deliveryPoint.order,
        {onDelete: 'CASCADE'}         
    )
    deliveryPoint: DeliveryPoint;
    
    @ApiProperty({
        type: () => User,
        description: 'Usuario que creó la orden',
    })
    @ManyToOne(
        () => User,
        (user) => user.ordersCreated,
        {onDelete: 'CASCADE'}         
    )
    user: User ;
    
    @ApiProperty({
        type: () => User,
        description: 'Usuario que entregó la orden (repartidor)',
    })
    @ManyToOne(
        () => User,
        (user) => user.ordersDelivered,
        {
            onDelete: 'CASCADE',
            nullable: true
        }         
    )
    deliveryUser: User | null ;
}
