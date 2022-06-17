import "reflect-metadata";
import express from 'express';
import { json } from 'body-parser';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from 'swagger-ui-express';
import { swaggerOptions } from './swagger';

const app = express();
const port = 3000;
app.use(json());

import { AppDataSource } from "./data-source";
import Routes from "./routes/Routes";

// CONFIGURE ROUTES
const routes = new Routes(app);
routes.buildRoutes();

// SETUP SWAGGER
const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log(swaggerDocs);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// LOG DATABASE INITIALIZATION
AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!");
}).catch(error => console.log(error))


/**
 * @swagger
 *  /jooj:
 *      get:
 *          description: Get test
 *          responses:
 *              200:
 *                  description: 'Success'
 * 
 */
app.get('/jooj', (req, res) => {
    res.send([
        {
            id: 2,
            title: 'Teste'
        }
    ]);
});

app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});