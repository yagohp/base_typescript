import "reflect-metadata";
import express from 'express';
import { json } from 'body-parser';
import { ExpressSwaggerRouter } from "express-joi-swagger-ts";

const app = express();
const port = 3000;
app.use(json());

import { AppDataSource } from "./data-source";
import Routes from "./routes/Routes";

const routes = new Routes(app);
routes.buildRoutes();

AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!");
}).catch(error => console.log(error))

const swaggerRouter = new ExpressSwaggerRouter({
    swagger: '2.0',
    info: {
        description:
            'Aplicação exemplo',
        title: 'Aplicação exemplo',
        version: '1.0.0',
        concat: {
            email: 'teste@teste.com'
        },
        license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    basePath: '',
    schemes: ['http', 'https'],
    paths: {},
    definitions: {},
    securityDefinitions: {
        JWT: {
            type: 'apiKey',
            in: 'header',
            name: 'Authorization'
        }
    }
});

swaggerRouter.setSwaggerFile("swagger.json");
swaggerRouter.loadSwaggerUI("/docs");
app.use(swaggerRouter.getRouter());

app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});