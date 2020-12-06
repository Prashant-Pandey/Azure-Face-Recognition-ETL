const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");

router.put('/:personGroupId', async (req, res) => {
  const { azureId, name, userData } = req.body;
  const { personGroupId } = req.params

  const body = {
    name,
    userData,
    recognitionModel: 'recognition_03'
  }

  const response = await connectAPI(`persongroups/${personGroupId}`, {}, body, azureId, 'put');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.delete('/:personGroupId', async (req, res) => {
  const { azureId } = req.body;
  const { personGroupId } = req.params;

  const response = await connectAPI(`persongroups/${personGroupId}`, {}, {}, azureId, 'delete');
  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:personGroupId', async (req, res) => {
  const { azureId } = req.body;
  const { personGroupId } = req.params
  const params = {
    returnRecognitionModel: false
  }
  const response = await connectAPI(`persongroups/${personGroupId}`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:personGroupId/train', async (req, res) => {
  const { azureId } = req.body;
  const { personGroupId } = req.params
  const response = await connectAPI(`persongroups/${personGroupId}/training`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/', async (req, res) => {
  const { azureId, returnRecognitionModel, start, top } = req.body;
  const params = {
    start, 
    top,
    returnRecognitionModel
  }
  const response = await connectAPI(`persongroups`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.post('/:personGroupId/train', async (req, res) => {
  const {
    azureId
  } = req.body;

  const { personGroupId } = req.params;

  const response = await connectAPI(`persongroups/${personGroupId}/train`, {}, {}, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.patch('/:personGroupId', async (req, res) => {
  const {
    azureId
  } = req.body;

  const { personGroupId } = req.params;

  const response = await connectAPI(`persongroups/${personGroupId}`, {}, {}, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});


module.exports = router;