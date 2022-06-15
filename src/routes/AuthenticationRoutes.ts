import UsersController from "../controller/UsersController";
import IRoutes, { Method } from "./IRoutes";
import * as Joi from "joi";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
export const SECRET_KEY: Secret = 'chavesegredo';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export default class AuthenticationRoutes implements IRoutes {

    private prefix: string;
    private usersController = new UsersController()

    constructor() {
        this.prefix = '/auth';
    }

    getRoutes = () => {
        return [
            {
                method: Method.POST,
                path: `${this.prefix}/register`,
                validationSchema: registerSchema,
                controllerFunc: this.usersController.saveUser
            },
            {
                method: Method.POST,
                path: `${this.prefix}/login`,
                validationSchema: loginSchema,
                controllerFunc: this.usersController.login
            }
        ]
    }

    getPrivateRoutes = () => {
        return [
            {
                method: Method.GET,
                path: `${this.prefix}/info`,
                validationSchema: Joi.object().unknown(true),
                controllerFunc: this.usersController.getUserInfo
            },
            {
                method: Method.PUT,
                path: `${this.prefix}/:id`,
                validationSchema: updateSchema,
                controllerFunc: this.usersController.updateUserInfo
            },
            {
                method: Method.DELETE,
                path: `${this.prefix}/:id`,
                validationSchema: Joi.object().unknown(true),
                controllerFunc: this.usersController.removeUser
            }
        ]
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        (req as CustomRequest).token = decoded;


        let validation = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(decoded._id);
        if (!validation) {
            res.status(400).send("Tipo de ID inválido");
            return;
        }

        next();
    } catch (err) {
        res.status(401).send('Token inválido');
    }
};

const loginSchema = Joi.object({
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required().messages({
            "string.email": `O campo 'email' precisa ser um e-mail válido`,
            "string.base": `O campo 'email' precisa ser do tipo string`,
            'string.empty': `O campo 'email' é obrigatório.`,
            "any.required": `O campo 'email' é obrigatório.`,
            'string.min': `O campo 'email' deve ter no mínimo {#limit} caracteres`,
            'string.max': `O campo 'email' deve ter no máximo {#limit} caracteres`,
        }),
    password: Joi.string().trim().pattern(/^[a-zA-Z0-9]{5,12}$/).required().messages({
        "string.pattern.base": `O campo 'password' precisa ter números e letras.`,
        "string.base": `O campo 'password' precisa ser do tipo string`,
        'string.empty': `O campo 'password' é obrigatório.`,
        "any.required": `O campo 'password' é obrigatório.`
    })
}).with('email', 'password');

const updateSchema = Joi.object({
    name: Joi.string().trim().min(5).max(150).required().messages({
        "string.base": `O campo 'name' precisa ser do tipo string`,
        'string.empty': `O campo 'name' é obrigatório.`,
        "any.required": `O campo 'name' é obrigatório.`,
        'string.min': `O campo 'name' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'name' deve ter no máximo {#limit} caracteres`,
    }),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required().messages({
            "string.email": `O campo 'email' precisa ser um e-mail válido`,
            "string.base": `O campo 'email' precisa ser do tipo string`,
            'string.empty': `O campo 'email' é obrigatório.`,
            "any.required": `O campo 'email' é obrigatório.`,
            'string.min': `O campo 'email' deve ter no mínimo {#limit} caracteres`,
            'string.max': `O campo 'email' deve ter no máximo {#limit} caracteres`,
        }),
    date_birth: Joi.date().min('1-1-1974').max('now').required().messages({
        "string.base": `O campo 'date_birth' precisa ser do tipo string e uma data válida`,
        'string.empty': `O campo 'date_birth' é obrigatório.`,
        "any.required": `O campo 'date_birth' é obrigatório.`,
        'string.min': `O campo 'date_birth' deve ser uma data maior que {#limit}`,
        'string.max': `O campo 'date_birth' deve ser uma data menor que {#limit}`,
    })
});

export const registerSchema = Joi.object({
    name: Joi.string().trim().min(5).max(150).required().messages({
        "string.base": `O campo 'name' precisa ser do tipo string`,
        'string.empty': `O campo 'name' é obrigatório.`,
        "any.required": `O campo 'name' é obrigatório.`,
        'string.min': `O campo 'name' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'name' deve ter no máximo {#limit} caracteres`,
    }),
    email: Joi.string().trim().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required().messages({
            "string.email": `O campo 'email' precisa ser um e-mail válido`,
            "string.base": `O campo 'email' precisa ser do tipo string`,
            'string.empty': `O campo 'email' é obrigatório.`,
            "any.required": `O campo 'email' é obrigatório.`,
            'string.min': `O campo 'email' deve ter no mínimo {#limit} caracteres`,
            'string.max': `O campo 'email' deve ter no máximo {#limit} caracteres`,
        }),
    password: Joi.string().trim().pattern(/^[a-zA-Z0-9]{5,12}$/).required().messages({
        "string.pattern.base": `O campo 'password' precisa ter números e letras.`,
        "string.base": `O campo 'password' precisa ser do tipo string`,
        'string.empty': `O campo 'password' é obrigatório.`,
        "any.required": `O campo 'password' é obrigatório.`
    }),
    repeat_password: Joi.string().valid(Joi.ref('password')).required().messages({
        "string.ref": `O campo 'repeat_password' não corresponde ao campo 'password'`,
        "string.base": `O campo 'repeat_password' precisa ser do tipo string`,
        'string.empty': `O campo 'repeat_password' é obrigatório.`,
        "any.required": `O campo 'repeat_password' é obrigatório.`
    }),
    date_birth: Joi.date().min('1-1-1974').max('now').required().messages({
        "string.base": `O campo 'date_birth' precisa ser do tipo string e uma data válida`,
        'string.empty': `O campo 'date_birth' é obrigatório.`,
        "any.required": `O campo 'date_birth' é obrigatório.`,
        'string.min': `O campo 'date_birth' deve ser uma data maior que {#limit}`,
        'string.max': `O campo 'date_birth' deve ser uma data menor que {#limit}`,
    })
}).with('email', 'password')
    .xor('password', 'access_token')
    .with('password', 'repeat_password');