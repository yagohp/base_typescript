import { Raw } from 'typeorm';
import { AppDataSource } from '../data-source';
import Address from '../entity/Address';
import User from '../entity/User';
import IAddressesRepository from './IAddressesRepository';

export default class AddressesRepository implements IAddressesRepository {

    private repository;

    constructor() {
        this.repository = AppDataSource.getRepository(Address);
    }

    all = async (user: User, contry: string) => {
        var whereStmt = {
            userId: user.id
        };

        if(contry){
            (whereStmt as any).country = Raw(alias => `${alias} LIKE '%${contry}%'`);
        }

        return this.repository.find({
            where: whereStmt
        });
    }

    findById = async (id: string) => {
        return this.repository.findOne({
            where: {
                id
            }
        });
    }

    save = async (address: Address) => {
        return this.repository.save(address);
    }

    update = async (address: Address) => {
        return this.repository.update({id: address.id}, {
            zipcode: address.zipcode,
            street: address.street,
            number: address.number,
            complement: address.complement,
            district: address.district,
            city: address.city,
            state: address.state,
            country: address.country
        }).then(res => {
            if(res.affected === 0){
                throw new Error('Não foi possível atualizar o endereço.');
            }
            return address;
        }).catch(err => new Error(err));
    }

    remove = async (address: Address) => {
        return this.repository.remove(address);
    }
}