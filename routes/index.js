const router = require("express").Router();
const faceAPI = require("./face.api");
const faceListAPI = require("./face.list.api");
const personListAPI = require("./persongroup.api");
const largeFaceListAPI = require("./face.list.large.api");

router.use('/face', faceAPI);
router.use('/facelist', faceListAPI);
router.use('/largefacelist', largeFaceListAPI);
router.use('/personlist', personListAPI);

module.exports = router;