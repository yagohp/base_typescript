import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import HttpException from "../exceptions/HttpException";

export enum Method { POST, GET, PUT, DELETE };

export type RoutesTypes = {
    method: Method
    path: string;
    validationSchema: Joi.ObjectSchema;
    controllerFunc: (req: Request, res: Response, next: NextFunction) => void;
};

export default interface IRoutes {
    getRoutes: () => RoutesTypes[];
    getPrivateRoutes: () => RoutesTypes[];
}

export function middleware(schema, type: string) {
    return async (req: Request, res: Response, next: NextFunction,) => {
        try {
            var data;
            if (type === "params") {
                data = req.params;
            } else if (type === "body") {
                data = req.body;
            }

            if (data === undefined) {
                res.status(400).json({ message: "Bad request" });
            }

            schema.validateAsync(data, { abortEarly: false }).then(() => {
                next();
            }).catch(err => {
                err.message = err.details.map(({ message }) => message);
                next(new HttpException(400, err.message));
            })
        } catch (err) {
            next(err);
        }
    }
}