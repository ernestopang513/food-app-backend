import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";




@Entity()
export class FoodStand {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar' , {
        unique: true,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true
    })
    location: string;

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
        default: false
    })
    is_open: boolean;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at: Date;

}
