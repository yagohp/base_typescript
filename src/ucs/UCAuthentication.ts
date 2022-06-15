import User, { UserStatus } from "../entity/User";
import IUsersRepository from "../repository/IUsersRepository";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SECRET_KEY } from "../routes/AuthenticationRoutes";
import IAddressesRepository from "../repository/IAddressesRepository";
const BCRYPT_HASH_SALT = 8;

export default class UCAuthentication {
    private repo: IUsersRepository;
    private repoAddresses: IAddressesRepository;

    constructor(repository: IUsersRepository, addrsRepo: IAddressesRepository) {
        this.repo = repository;
        this.repoAddresses = addrsRepo;
    }

    registerUser = async (user: User) => {
        user.password = await bcrypt.hash(user.password, BCRYPT_HASH_SALT);
        return this.repo.save(user).then(insertedUser => insertedUser).catch(_error => {
            throw new Error('Esse usuário já existe. Por favor, tente com outro e-mail.');
        });
    }

    login = async (email: string, password: string) => {
        let registerResult = await this.repo.findByEmail(email).catch(_error => {
            throw new Error('Ocoreu um erro ao tentar encontrar o usuário.');
        });
        if (!registerResult) {
            throw new Error('E-mail não encontrado em nossa base de dados.');
        }

        if (bcrypt.compareSync(password, registerResult.password)) {
            if (registerResult.status == UserStatus.PENDING) {
                throw new Error('Por favor, confirme sua conta através do e-mail que foi enviado no momento do seu cadastro.');
            } else if (registerResult.status == UserStatus.BLOQUED) {
                throw new Error('Seu usuário foi bloqueado.');
            }

            const token = jwt.sign({ _id: registerResult.id?.toString(), name: registerResult.name }, SECRET_KEY, {
                expiresIn: '2 days',
            });

            registerResult.token = token;

            return registerResult;
        } else {
            throw new Error('Senha inválida.');
        }
    }

    getUserInfo = async (id: string) => {
        return this.repo.findById(id)
            .then(async user => {
                return this.repoAddresses.all(user, '')
                    .then(res => {
                        user.addresses = res
                        return user;
                    })
                    .catch(err => {
                        return user;
                    });
            })
            .catch(err => {
                throw new Error('Usuário não encontrado.');
            });
    }

    updateUserInfo = async (loggedId: string, userId: string, user: User) => {
        await this.getUserInfo(userId)
            .then(res => {
                if (loggedId !== res.id) {
                    throw new Error('Você não tem permissão para alterar os dados desse perfil.');
                }

                user.id = res.id;
                return  res;
            })
            .catch(err => {
                throw new Error('Não foi possível atualizar o Usuário.');
            });

        return this.repo.update(user).then(result => result).catch(error => error);
    }

    removeUser = async (loggedId: string, userId: string) => {
        let user = await this.getUserInfo(userId)
            .then(res => {
                if (!res){
                    throw new Error('Esse usuário não existe.');
                }

                if(loggedId !== res.id) {
                    throw new Error('Você não tem permissão para alterar os dados desse perfil.');
                }

                return  res;
            })
            .catch(err => {
                throw new Error(err.message);
            });

        return this.repo.remove(user)
            .then(res => res)
            .catch(err => err);
    }
}