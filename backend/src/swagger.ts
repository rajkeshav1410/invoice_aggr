import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "INVOICE_AGGR",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Vahsekjar",
                url: "https://github.com/rajkeshav1410/invoice_aggr",
                email: "www.keshav.mars@gmail.com",
            },
        },
        servers: [
            {
                url: `${process.env.BASE_URL}:${process.env.PORT}`,
            },
        ],
    },
    apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);
export default specs