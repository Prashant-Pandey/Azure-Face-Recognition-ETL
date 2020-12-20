const router = require("express").Router();
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('../swagger/AZURE-ETL-API.json');
const faceAPI = require("./face.api");
const faceListAPI = require("./face.list.api");
const personListAPI = require("./persongroup.api");
const largeFaceListAPI = require("./face.list.large.api");
const largePersonListAPI = require("./persongroup.large.api");

router.use('/face', faceAPI);
router.use('/facelist', faceListAPI);
router.use('/largefacelist', largeFaceListAPI);
router.use('/personlist', personListAPI);
router.use('/largepersonlist', largePersonListAPI);


router.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = router;