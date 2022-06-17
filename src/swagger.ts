export const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Teste',
            version: '1.0.0'
        }
    },
    apis: [`${__dirname}/routes/*.ts`, `${__dirname}/definitions.yml`]
}