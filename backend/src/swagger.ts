const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config();

const doc = {
  info: {
    title: "INVOICE_AGGR",
    description: "Description",
  },
  license: {
    name: "MIT",
    url: "https://spdx.org/licenses/MIT.html",
  },
  contact: {
    name: "Vahsekjar",
    url: "https://github.com/rajkeshav1410/invoice_aggr",
    email: "www.keshav.mars@gmail.com",
  },
  host: `${process.env.BASE_URL}:${process.env.PORT}`,
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["dist/server.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);