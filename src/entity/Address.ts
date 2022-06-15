import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import User from "./User";

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 255,
    })
    street: string;

    @Column({
        length: 4,
    })
    number: string;

    @Column({
        length: 100,
    })
    complement: string;

    @Column({
        length: 100,
    })
    district: string;

    @Column({
        length: 255,
    })
    country: string;

    @Column({
        length: 255,
    })
    city: string;

    @Column({
        length: 2,
    })
    state: string;

    @Column({
        length: 10,
    })
    zipcode: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @Column({type: "uuid"})
    userId: string;

    @ManyToOne(_type => User, { cascade: true, onDelete: "CASCADE" })
    user: User;
}

export default Address;
