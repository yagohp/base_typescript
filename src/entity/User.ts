import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import Address from "./Address";


export enum UserStatus {
    ACTIVE = "A",
    PENDING = "P",
    BLOQUED = "B"
}

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 150,
    })
    name: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;

    @Column({
        nullable: true
    })
    token: string;

    @Column()
    date_birth: string;

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.PENDING
    })
    status: UserStatus;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @OneToMany(_type => Address, address => address.user)
    addresses: Address[];
}

export default User;