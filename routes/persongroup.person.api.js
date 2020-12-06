const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");

router.post('/', async (req, res) => {
  const { azureId, name, userData, personGroupId } = req.body;

  const body = {
    name,
    userData,
  }

  const response = await connectAPI(`persongroups/${personGroupId}/persons`, {}, body, azureId, 'post');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.post('/:personId', upload.single('img'), async (req, res) => {
  const {
    azureId,
    userData,
    targetFace,
    personGroupId
  } = req.body;
  const fileName = req.imgFileName;
  const imageUrl = 'https://i.pinimg.com/originals/27/27/44/27274483c7861355374b32330fcad289.jpg';
  const { personId } = req.params;
  const params = {
    userData,
    targetFace,
    detectionModel: 'detection_01',
  }

  const body = {
    url: imageUrl
  }

  const response = await connectAPI(`persongroups/${personGroupId}/persons/${personId}/persistedFaces`, params, body, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.delete('/:personId', async (req, res) => {
  const { azureId, personGroupId } = req.body;
  const { personId } = req.params;

  const response = await connectAPI(`persongroups/${personGroupId}/persons/${personId}`, {}, {}, azureId, 'delete');
  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.delete('/face/:persistedFaceId', async (req, res) => {
  const { persistedFaceId } = req.params;
  const { personId, personGroupId, azureId } = req.body;
  const params = {
    returnRecognitionModel: true
  }
  const response = await connectAPI(`persongroups/${personGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'delete');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:personId', async (req, res) => {
  const { azureId, personGroupId } = req.body;
  const { personId } = req.params
  const response = await connectAPI(`persongroups/${personGroupId}/persons/${personId}`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/face/:persistedFaceId', async (req, res) => {
  const { azureId, personGroupId, personId } = req.body;
  const { persistedFaceId } = req.params
  const response = await connectAPI(`persongroups/${personGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/', async (req, res) => {
  const { azureId, personGroupId, start, top } = req.body;
  const params = {
    start, top
  }
  const response = await connectAPI(`persongroups/${personGroupId}/persons`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.patch('/:personId', async (req, res) => {
  const {
    azureId,
    personGroupId
  } = req.body;

  const { personId } = req.params;

  const response = await connectAPI(`persongroups/${personGroupId}/persons/${personId}`, {}, {}, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.patch('/face/:persistedFaceId', async (req, res) => {
  const {
    userData,
    personGroupId,
    personId,
    azureId
  } = req.body;

  const { persistedFaceId } = req.params;

  const body = {
    userData
  }

  const response = await connectAPI(`persongroups/${personGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, body, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});


module.exports = router;