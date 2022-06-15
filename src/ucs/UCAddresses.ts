import IUsersRepository from "../repository/IUsersRepository";
import IAddressesRepository from "../repository/IAddressesRepository";
import Address from "../entity/Address";

export default class UCAddresses {
    private repoUsers: IUsersRepository;
    private repoAddresses: IAddressesRepository;

    constructor(usersRepo: IUsersRepository, addrsRepo: IAddressesRepository) {
        this.repoUsers = usersRepo;
        this.repoAddresses = addrsRepo;
    }

    insertAddress = async (userId: string, address: Address) => {
        let user = this.repoUsers.findById(userId)
            .then(res => res)
            .catch(err => {
                throw new Error('Usuário não encontrado.');
            });

        address.userId = (await user).id;
        return this.repoAddresses.save(address)
            .then(res => res)
            .catch(err => {
                throw new Error('Não foi possível inserir o endereço.');
            });
    }

    updateAddress = async (userId: string, addressId: string, address: Address) => {
        await this.repoAddresses.findById(addressId)
            .then(res => {
                if (userId !== res.userId) {
                    throw new Error('O endereço não pertence ao usuário logado.');
                }
                address.userId = res.userId;
                address.id = res.id;
            })
            .catch(err => {
                throw new Error('Enderenço não encontrado.');
            });

        return this.repoAddresses.update(address)
            .then(res => res)
            .catch(err => {
                throw new Error('Não foi possível atualizar o endereço.');
            });
    }

    removeAddress = async (userId: string, addressId: string) => {
        let address = await this.repoAddresses.findById(addressId)
            .then(res => {
                console.log(res);
                if (userId !== res.userId) {
                    throw new Error('O endereço não pertence ao usuário logado.');
                }
                return res;
            })
            .catch(err => {
                throw new Error('Enderenço não encontrado.');
            });

        return this.repoAddresses.remove(address)
            .then(res => res)
            .catch(err => err);
    }

    getUserAddresses = async (userId: string, _countryFilter: string) => {
        let user = this.repoUsers.findById(userId)
            .then(res => res)
            .catch(err => {
                throw new Error('Usuário não encontrado.');
            });

        return this.repoAddresses.all(await user, _countryFilter)
            .then(res => res)
            .catch(err => {
                return new Array<Address>();
            });
    }

    getAddress = async (userId: string, addressId: string) => {
        return this.repoAddresses.findById(addressId)
            .then(res => {
                if (userId !== res.userId) {
                    throw new Error('O endereço não pertence ao usuário logado.');
                }
                return res;
            })
            .catch(err => {
                throw new Error('Endereço não encontrado.');
            });
    }
}