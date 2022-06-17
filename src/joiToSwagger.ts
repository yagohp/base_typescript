import parse from 'joi-to-json';
import * as Joi from "joi";

var loginSchema = Joi.object({
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
}).with('email', 'password').label('Login');

const jsonSchema = parse(loginSchema)


console.log(JSON.stringify(jsonSchema));
