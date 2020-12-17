const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");

router.put('/:largePersonGroupId', async (req, res) => {
  const { name, userData } = req.body;
  const { largePersonGroupId } = req.params;

  const body = {
    name,
    userData,
    recognitionModel: "recognition_03"
  }
  console.log(azureId);
  const response = await connectAPI(`largepersongroups/${largePersonGroupId}`, {}, body, null, 'put');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.delete('/:largePersonGroupId', async (req, res) => {
  const { azureId } = req.body;
  const { largePersonGroupId } = req.params;

  const response = await connectAPI(`largepersongroups/${largePersonGroupId}`, {}, {}, azureId, 'delete');
  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:largePersonGroupId', async (req, res) => {
  const { azureId } = req.body;
  const { largePersonGroupId } = req.params;
  const body = {
    returnRecognitionModel: true
  }
  const response = await connectAPI(`largepersongroups/${largePersonGroupId}`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/:largePersonGroupId/train', async (req, res) => {
  const { azureId } = req.body;
  const { largePersonGroupId } = req.params
  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/training`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.get('/', async (req, res) => {
  const { azureId, start, top } = req.body;
  const params = {
    start, top,
    returnRecognitionModel: true
  }
  const response = await connectAPI(`largepersongroups`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.post('/:largePersonGroupId', async (req, res) => {
  const {
    largePersonGroupId
  } = req.params;

  const response = await connectAPI(`largepersongroups/${largePersonGroupId}/train`, {}, {}, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.patch('/:largePersonGroupId', async (req, res) => {
  const { name, userData, azureId } = req.body;
  const {
    largePersonGroupId
  } = req.params;

  const body = { name, userData }

  const response = await connectAPI(`largepersongroups/${largePersonGroupId}`, {}, body, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

module.exports = router;