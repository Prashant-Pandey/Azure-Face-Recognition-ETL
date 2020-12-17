const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");
const uploadToAzure = require("../middlewares/azure.container.upload.middleware");

router.post('/', async (req, res) => {
  const { azureId, name, userData, largePersonGroupId } = req.body;

  const body = {
    name,
    userData,
  }

  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons`, {}, body, azureId, 'post');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.post('/:personId', upload.single('img'), uploadToAzure, async (req, res) => {
  const {
    azureId,
    userData,
    targetFace,
    largePersonGroupId
  } = req.body;
  
  const imageUrl = req.imgFileURL;
  const { personId } = req.params;
  const params = {
    userData: userData,
    targetFace: targetFace,
    detectionModel: 'detection_01'
  }

  const body = {
    url: imageUrl
  }

  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}/persistedfaces`, params, body, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.delete('/:personId', async (req, res) => {
  const { azureId, largePersonGroupId } = req.body;
  const { personId } = req.params;

  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}`, {}, {}, azureId, 'delete');
  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.delete('/face/:persistedFaceId', async (req, res) => {
  const { persistedFaceId } = req.params;
  const { personId, largePersonGroupId, azureId } = req.body;
  const params = {
    returnRecognitionModel: true
  }
  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'delete');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:personId', async (req, res) => {
  const { azureId, largePersonGroupId } = req.body;
  const { personId } = req.params
  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/face/:persistedFaceId', async (req, res) => {
  const { azureId, largePersonGroupId, personId } = req.body;
  const { persistedFaceId } = req.params
  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/', async (req, res) => {
  const { azureId, largePersonGroupId, start, top } = req.body;
  const params = {
    start, top
  }
  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons`, params, {}, azureId, 'get');

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
    largePersonGroupId
  } = req.body;

  const { personId } = req.params;

  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}`, {}, {}, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.patch('/face/:persistedFaceId', async (req, res) => {
  const {
    userData,
    largePersonGroupId,
    personId,
    azureId
  } = req.body;

  const { persistedFaceId } = req.params;

  const body = {
    userData
  }

  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, body, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});


module.exports = router;