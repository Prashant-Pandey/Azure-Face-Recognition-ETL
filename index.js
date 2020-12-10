var express = require("express");
require("dotenv").config();
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUI = require('swagger-ui-express')
var app = express();
const faceAPI = require("./routes/face.api");
const faceListAPI = require("./routes/facelist.api");
const faceListLargeAPI = require("./routes/facelist.large.api");

app.use('/uploads', express.static('./uploads/'));
app.use(express.json())
app.use('/face', faceAPI);
app.use('/facelist', faceListAPI);
app.use('/facelistlarge', faceListLargeAPI);

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Azure Face ETL API',
            version: '1.0.0',
            description: 'API for company listing'
        },
        host: 'http://localhost:4000',
        basePath: '/'
    },
    apis: [
        './routes/face.api.js',
        './routes/facelist.api.js',
        './routes/facelist.large.api.js',
        './routes/person.api.js',
        './routes/persongroup.api.js',
        './routes/persongroup.large.api.js',
        './routes/persongroup.large.person.api.js',
        './routes/persongroup.person.api.js',
        './routes/snapshot.api.js'
    ]
};

const specs = swaggerJSDoc(swaggerOptions);

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(4000, () => console.log('now graphql at localhost:4000'));
