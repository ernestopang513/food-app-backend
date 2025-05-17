import { ApiProperty } from "@nestjs/swagger";
import { Order } from "src/order/entities/order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class DeliveryPoint {


    @ApiProperty({
            example: 'c8aeeb0b-f04b-40c1-9294-4b37576a4959',
            description: 'DeliveryPoint ID',
            uniqueItems: true
        })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Filosofia',
        description: 'Nombre del punto de entrega',
        uniqueItems: false
    })
    @Column({
        type: 'text',
        nullable: false,
    })
    name: string;

   @ApiProperty({
        example: 19.33125638836458,
        description: 'Coordenadas de latitud del punto de entrega'
    })
    @Column({
        type: 'float',
        nullable: false
    })
    latitude: number;

    @ApiProperty({
        example: -99.18388852822785,
        description: 'Coordenadas de longitud del punto de entrega'
    })
    @Column({
        type: 'float',
        nullable: false
    })
    longitude: number;

    @ApiProperty({
        example: true,
        description: 'Indicador para saber si el punto de entrega esta activo',
        default: false
    })
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
