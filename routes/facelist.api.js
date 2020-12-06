const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");

router.post('/', upload.single('img'), async (req, res) => {
  const { faceListId, userData, targetFace, azureId } = req.body;
  const fileName = req.imgFileName;
  const imageUrl = 'https://i.pinimg.com/originals/27/27/44/27274483c7861355374b32330fcad289.jpg';
  const params = {
    userData,
    targetFace,
    detectionModel: "detection_01",
    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
    returnFaceLandmarks: true,
    recognitionModel: 'recognition_03',
    returnRecognitionModel: true,
  }

  const body = {
    url: imageUrl
  }

  const response = await connectAPI(`facelists/${faceListId}/persistedFaces`, params, body, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.put('/', async (req, res) => {
  const {
    faceListId,
    azureId
  } = req.body;

  const response = await connectAPI(`facelists/${faceListId}`, {}, {}, azureId, 'put');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.delete('/:faceListId', async (req, res) => {
  console.log(req.body);
  const { azureId } = req.body;
  const {faceListId} = req.params;

  const response = await connectAPI(`facelists/${faceListId}`, {}, {}, azureId, 'delete');
  console.log(response.error);
  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.delete('/face', async (req, res) => {
  const { faceListId, persistedFaceId, azureId } = req.body;
  const response = await connectAPI(`facelists/${faceListId}/persistedFaces/${persistedFaceId}`, {}, {}, azureId, 'delete');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:faceListId', async (req, res) => {
  const { faceListId } = req.params;
  const { azureId } = req.body;
  const params = {
    returnRecognitionModel: true
  }
  const response = await connectAPI(`facelists/${faceListId}`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/', async (req, res) => {
  const { azureId } = req.body;
  const params = {
    returnRecognitionModel: true
  }
  const response = await connectAPI(`facelists`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.patch('/', async (req, res) => {
  const {
    faceListId,
    name,
    userData, 
    azureId
  } = req.body;

  const body = {
    name,
    userData
  }

  const response = await connectAPI(`facelists/${faceListId}`, {}, body, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});


module.exports = router;