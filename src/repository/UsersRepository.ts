import { Raw } from 'typeorm';
import { AppDataSource } from '../data-source';
import User, { UserStatus } from '../entity/User';
import IUsersRepository from './IUsersRepository';

export default class UsersRepository implements IUsersRepository {

    private repository;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    findByName = async (name: string) => {
        return this.repository.findOne({
            where: {
                name: Raw(alias => `${alias} ILIKE '%${name}%'`)
            }
        });
    }

    findByEmail = async (email: string) => {
        return this.repository.findOne({
            where: {
                email
            }
        });
    }

    findById = async (id: string) => {
        return this.repository.findOne({
            where: {
                id
            }
        });
    }

    save = async (user: User) => {
        return this.repository.save(user);
    }

    activeUserStatus = async (user: User) => {
        user.status = UserStatus.ACTIVE;
        return this.repository.update({id: user.id}, {
            state: UserStatus.ACTIVE,
        }).then(res => {
            if(res.affected === 0){
                throw new Error('Não foi possível atualizar o endereço.');
            }
            return user;
        }).catch(err => new Error(err));
    }

    update = async (user: User) => {
        return this.repository.update({id: user.id}, {
            name: user.name,
            email: user.email,
            date_birth: user.date_birth
        }).then(res => {
            if(res.affected === 0){
                throw new Error('Não foi possível atualizar o usuário.');
            }

            return user;
        }).catch(err => new Error(err));
    }

    remove = async (user: User) => {
        return this.repository.remove(user);
    }
}