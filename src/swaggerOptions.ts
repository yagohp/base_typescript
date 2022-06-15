export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Projeto Exemplo',
            version: "1.0.0",
            description: "Exemplo básico de API"
        },
        servers: [
            {
                url: "htp://localhost:3000"
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
}