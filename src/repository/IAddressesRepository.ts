import Address from "../entity/Address";
import User from "../entity/User";

export default interface IAddressesRepository {
    save: (address: Address) => Promise<Address>;
    update: (address: Address) => Promise<Address>;
    all: (user: User, contry: string) => Promise<Array<Address> | undefined>;
    findById: (id: string) => Promise<Address | undefined>;
    remove: (address: Address) => Promise<Address>;
}