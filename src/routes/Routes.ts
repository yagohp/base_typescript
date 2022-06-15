import AuthenticationRoutes, { authMiddleware } from "./AuthenticationRoutes";
import { RoutesTypes, Method, middleware } from "./IRoutes";
import core, { NextFunction, Request, Response } from 'express';
import HttpException from "../exceptions/HttpException";
import AddressesRoutes from "./AddressesRoutes";

export default class Routes {

    private routes: RoutesTypes[];
    private privateRoutes: RoutesTypes[];
    private app: core.Express;
    private routesPrefix: string;

    constructor(app: core.Express) {
        this.app = app;
        this.routesPrefix = '/api'
        this.routes = new Array<RoutesTypes>();
        this.privateRoutes = new Array<RoutesTypes>();

        let authRoutes = new AuthenticationRoutes();
        this.routes = this.routes.concat(authRoutes.getRoutes());
        this.privateRoutes = this.privateRoutes.concat(authRoutes.getPrivateRoutes());

        let addrRoutes = new AddressesRoutes();
        this.privateRoutes = this.privateRoutes.concat(addrRoutes.getPrivateRoutes());
    }

    buildRoutes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Health Check');
        })

        this.routes.forEach((route: RoutesTypes) => {
            switch (route.method) {
                case Method.GET:
                    this.app.get(`${this.routesPrefix}${route.path}`, middleware(route.validationSchema, 'params'), route.controllerFunc);
                    break;
                case Method.POST:
                    this.app.post(`${this.routesPrefix}${route.path}`, middleware(route.validationSchema, 'body'), route.controllerFunc);
                    break;
                case Method.PUT:
                    this.app.put(`${this.routesPrefix}${route.path}`, middleware(route.validationSchema, 'body'), route.controllerFunc);
                    break;
                case Method.DELETE:
                    this.app.delete(`${this.routesPrefix}${route.path}`, middleware(route.validationSchema, 'body'), route.controllerFunc);
                    break;
            }
        });

        this.privateRoutes.forEach((route: RoutesTypes) => {
            switch (route.method) {
                case Method.GET:
                    this.app.get(`${this.routesPrefix}${route.path}`, authMiddleware, middleware(route.validationSchema, 'params'), route.controllerFunc);
                    break;
                case Method.POST:
                    this.app.post(`${this.routesPrefix}${route.path}`, authMiddleware, middleware(route.validationSchema, 'body'), route.controllerFunc);
                    break;
                case Method.PUT:
                    this.app.put(`${this.routesPrefix}${route.path}`, authMiddleware, middleware(route.validationSchema, 'body'), route.controllerFunc);
                    break;
                case Method.DELETE:
                    this.app.delete(`${this.routesPrefix}${route.path}`, authMiddleware, middleware(route.validationSchema, 'body'), route.controllerFunc);
                    break;
            }
        })

        this.app.use(this.errorMiddleware);
    }

    errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
        const status = error.status || 500;
        const errors = 'Something went wrong';

        if (error.messageArr != undefined) {
            response
                .status(status)
                .send({
                    status,
                    errors: error.messageArr,
                })
        } else if (error.message != undefined) {
            response
                .status(status)
                .send({
                    status,
                    errors: error.message,
                })
        }else{
            response
            .status(status)
            .send({
                status,
                errors,
            })
        }
    }
}