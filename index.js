var express = require("express");
require("dotenv").config();
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUI = require('swagger-ui-express')
var app = express();
const v1 = require("./routes/");

app.use('/uploads', express.static('./uploads/'));
app.use(express.json())
app.use('/v1', v1);

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Azure ETL API',
            version: '1.0.0',
            description: 'ETL API which makes seamless and fast integration of Azure Face API'
        },
        host: '0.0.0.0:4001',
        basePath: '/v1'
    },
    apis: [
        './routes/face.api.js',
        './routes/facelist.api.js',
        './routes/persongroup.api.js',
    ]
};

const specs = swaggerJSDoc(swaggerOptions);

app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(4000, () => console.log('now graphql at localhost:4000'));
