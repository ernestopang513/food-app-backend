import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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
}
