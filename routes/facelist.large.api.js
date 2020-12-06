const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");

router.post('/', upload.single('img'), async (req, res) => {
  const { largeFaceListId, userData, targetFace, azureId } = req.body;
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

  const response = await connectAPI(`largefacelists/${largeFaceListId}/persistedFaces`, params, body, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.put('/', async (req, res) => {
  const {
    largeFaceListId,
    azureId
  } = req.body;

  const response = await connectAPI(`largefacelists/${largeFaceListId}`, {}, {}, azureId, 'put');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.delete('/:largeFaceListId', async (req, res) => {
  console.log(req.body);
  const { azureId } = req.body;
  const { largeFaceListId } = req.params;

  const response = await connectAPI(`largefacelists/${largeFaceListId}`, {}, {}, azureId, 'delete');
  console.log(response.error);
  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.delete('/face', async (req, res) => {
  const { largeFaceListId, persistedFaceId, azureId } = req.body;
  const response = await connectAPI(`largefacelists/${largeFaceListId}/persistedFaces/${persistedFaceId}`, {}, {}, azureId, 'delete');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/', async (req, res) => {
  const { azureId } = req.body;
  const { start, top } = req.params;

  const params = {
    start,
    top,
    returnRecognitionModel: true
  }

  const response = await connectAPI(`largefacelists`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:largeFaceListId', async (req, res) => {
  const { largeFaceListId } = req.params;
  const { azureId } = req.body;
  const params = {
    returnRecognitionModel: true
  }
  const response = await connectAPI(`largefacelists/${largeFaceListId}`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/face/:largeFaceListId', async (req, res) => {
  const { persistedFaceId, start, end, azureId } = req.body;
  const { largeFaceListId } = req.params;
  let response = {}
  if (persistedFaceId) {
    response = await connectAPI(`largefacelists/${largeFaceListId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'get');
  } else {
    const params = {
      start,
      end
    }
    response = await connectAPI(`largefacelists/${largeFaceListId}/persistedfaces`, params, {}, azureId, 'get');
  }


  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:largeFaceListId/train', async (req, res) => {
  const { azureId } = req.body;
  const { largeFaceListId } = req.params;

  const response = await connectAPI(`largefacelists/${largeFaceListId}/training`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.post('/:largeFaceListId/train', async (req, res) => {
  const { azureId } = req.body;
  const { largeFaceListId } = req.params;

  const response = await connectAPI(`largefacelists/${largeFaceListId}/train`, {}, {}, azureId, 'patch');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.patch('/:largeFaceListId', async (req, res) => {
  const {
    name,
    userData,
    azureId
  } = req.body;

  const { largeFaceListId } = req.params;

  const body = {
    name,
    userData
  }

  const response = await connectAPI(`largefacelists/${largeFaceListId}`, {}, body, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.patch('/:largeFaceListId/persistedfaces/:persistedFaceId', async (req, res) => {
  const {
    userData,
    azureId
  } = req.body;
  
  const { largeFaceListId, persistedFaceId } = req.params;

  const body = {
    name,
    userData
  }

  const response = await connectAPI(`largefacelists/${largeFaceListId}/persistedfaces/${persistedFaceId}`, {}, body, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});


module.exports = router;