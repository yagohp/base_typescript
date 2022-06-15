import "reflect-metadata"
import { DataSource } from "typeorm"

// ** MODELS ********************************//
import { User } from "./entity/User"
import { Address } from "./entity/Address"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres_nodeapp",
    port: 5432,
    username: "root",
    password: "root",
    database: "nodeapplication",
    synchronize: true,
    logging: true,
    entities: [User, Address],
    migrations: [],
    subscribers: [],
})
