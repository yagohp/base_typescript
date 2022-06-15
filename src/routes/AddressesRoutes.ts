import IRoutes, { Method } from "./IRoutes";
import * as Joi from "joi";
import AddressesController from "../controller/AddressesController";

export default class AddressesRoutes implements IRoutes {

    private prefix: string;
    private controller = new AddressesController()

    constructor() {
        this.prefix = '/user/address';
    }

    getRoutes = () => {
        return []
    }

    getPrivateRoutes = () => {
        return [
            {
                method: Method.POST,
                path: `${this.prefix}`,
                validationSchema: saveSchema,
                controllerFunc: this.controller.saveAddress
            },
            {
                method: Method.PUT,
                path: `${this.prefix}/:id`,
                validationSchema: saveSchema,
                controllerFunc: this.controller.updateAddress
            },
            {
                method: Method.DELETE,
                path: `${this.prefix}/:id`,
                validationSchema: Joi.object().unknown(true),
                controllerFunc: this.controller.removeAddress
            },
            {
                method: Method.GET,
                path: `${this.prefix}/:id`,
                validationSchema: Joi.object().unknown(true),
                controllerFunc: this.controller.getSingleAddress
            },
            {
                method: Method.GET,
                path: `${this.prefix}`,
                validationSchema: Joi.object().unknown(true),
                controllerFunc: this.controller.getAllAddresses
            }
        ]
    }
}

const saveSchema = Joi.object({
    zipcode: Joi.string().trim().min(8).max(10).required().messages({
        "string.base": `O campo 'zipcode' precisa ser do tipo string`,
        'string.empty': `O campo 'zipcode' é obrigatório.`,
        "any.required": `O campo 'zipcode' é obrigatório.`,
        'string.min': `O campo 'zipcode' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'zipcode' deve ter no máximo {#limit} caracteres`,
    }),
    street: Joi.string().trim().min(5).max(255).required().messages({
        "string.base": `O campo 'street' precisa ser do tipo string`,
        'string.empty': `O campo 'street' é obrigatório.`,
        "any.required": `O campo 'street' é obrigatório.`,
        'string.min': `O campo 'street' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'street' deve ter no máximo {#limit} caracteres`,
    }),
    number: Joi.string().trim().min(1).max(4).required().messages({
        "string.base": `O campo 'number' precisa ser do tipo string`,
        'string.empty': `O campo 'number' é obrigatório.`,
        "any.required": `O campo 'number' é obrigatório.`,
        'string.min': `O campo 'number' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'number' deve ter no máximo {#limit} caracteres`,
    }),
    complement: Joi.string().trim().min(3).max(100).required().messages({
        "string.base": `O campo 'complement' precisa ser do tipo string`,
        'string.empty': `O campo 'complement' é obrigatório.`,
        "any.required": `O campo 'complement' é obrigatório.`,
        'string.min': `O campo 'complement' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'complement' deve ter no máximo {#limit} caracteres`,
    }),
    district: Joi.string().trim().min(5).max(100).required().messages({
        "string.base": `O campo 'district' precisa ser do tipo string`,
        'string.empty': `O campo 'district' é obrigatório.`,
        "any.required": `O campo 'district' é obrigatório.`,
        'string.min': `O campo 'district' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'district' deve ter no máximo {#limit} caracteres`,
    }),
    city: Joi.string().trim().min(5).max(255).required().messages({
        "string.base": `O campo 'city' precisa ser do tipo string`,
        'string.empty': `O campo 'city' é obrigatório.`,
        "any.required": `O campo 'city' é obrigatório.`,
        'string.min': `O campo 'city' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'city' deve ter no máximo {#limit} caracteres`,
    }),
    state: Joi.string().trim().min(2).max(2).required().messages({
        "string.base": `O campo 'state' precisa ser do tipo string`,
        'string.empty': `O campo 'state' é obrigatório.`,
        "any.required": `O campo 'state' é obrigatório.`,
        'string.min': `O campo 'state' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'state' deve ter no máximo {#limit} caracteres`,
    }),
    country: Joi.string().trim().min(2).max(255).required().messages({
        "string.base": `O campo 'country' precisa ser do tipo string`,
        'string.empty': `O campo 'country' é obrigatório.`,
        "any.required": `O campo 'country' é obrigatório.`,
        'string.min': `O campo 'country' deve ter no mínimo {#limit} caracteres`,
        'string.max': `O campo 'country' deve ter no máximo {#limit} caracteres`,
    })
});