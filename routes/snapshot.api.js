const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");

router.post('/:snapshot_id', async (req, res) => {
  const { azureId, objectId, mode } = req.body;
  const {snapshot_id} = req.params;

  const body = {
    objectId, mode
  }

  const response = await connectAPI(`snapshots/${snapshot_id}/apply`, {}, body, azureId, 'post');

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.post('/', async (req, res) => {
  const {
    azureId,
    type,
    objectId,
    applyScope,
    userData
  } = req.body;

  const body = {
    type,
    objectId,
    applyScope,
    userData
  }

  const response = await connectAPI(`snapshots`, {}, body, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json(response)
});

router.delete('/:snapshot_id', async (req, res) => {
  const { azureId } = req.body;
  const { snapshot_id } = req.params;

  const response = await connectAPI(`snapshots/${snapshot_id}`, {}, {}, azureId, 'delete');
  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.get('/:snapshot_id', async (req, res) => {
  const { azureId } = req.body;
  const { snapshot_id } = req.params
  const response = await connectAPI(`snapshots/${snapshot_id}`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.get('/operation/:operation_id', async (req, res) => {
  const { azureId } = req.body;
  const { operation_id } = req.params
  const response = await connectAPI(`operations/${operation_id}`, {}, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.get('/', async (req, res) => {
  const { azureId, type, applyScope } = req.body;
  const params = {
    type, applyScope
  }
  const response = await connectAPI(`snapshots`, params, {}, azureId, 'get');

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.patch('/:snapshot_id', async (req, res) => {
  const {
    applyScope,
    userData,
    azureId
  } = req.body;

  const { snapshot_id } = req.params;

  const body = {
    applyScope,
    userData
  }

  const response = await connectAPI(`snapshots/${snapshot_id}`, {}, body, azureId, 'patch');
  if (response.error) {
    res.status(response.status).json(response);
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
    res.status(response.status).json(response);
    return;
  }

  res.json(response)
});


module.exports = router;