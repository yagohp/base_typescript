import User from "../entity/User";

export default interface IUsersRepository {
    findByName: (name: string) => Promise<User | undefined>;
    findByEmail: (email: string) => Promise<User | undefined>;
    findById: (id: string) => Promise<User | undefined>;
    save: (user: User) => Promise<User>;
    activeUserStatus: (user: User) => Promise<User>; 
    update: (user: User) => Promise<User>;
    remove: (user: User) => Promise<User>;
}