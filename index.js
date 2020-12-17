var express = require("express");
require("dotenv").config();
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUI = require('swagger-ui-express')
var app = express();
const faceAPI = require("./routes/face.api");
const faceListAPI = require("./routes/facelist.api");
const faceListLargeAPI = require("./routes/facelist.large.api");
const personListLargeAPI = require("./routes/persongroup.large.api");
const personLargeAPI = require("./routes/persongroup.large.person.api")

app.use('/uploads', express.static('./uploads/'));
app.use(express.json())
app.use('/face', faceAPI);
app.use('/facelist', faceListAPI);
app.use('/largefacelist', faceListLargeAPI);
app.use('/largepersonlist', personListLargeAPI);
app.use('/largeperson', personLargeAPI);

// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             title: 'Company API',
//             version: '1.0.0',
//             description: 'API for company listing'
//         },
//         host: '0.0.0.0:4001',
//         basePath: '/'
//     },
//     apis: [
//         './index.js'
//     ]
// };

// const specs = swaggerJSDoc(swaggerOptions);

// app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(4000, () => console.log('now graphql at localhost:4000'));
