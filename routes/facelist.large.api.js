const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");
const uploadToAzure = require("../middlewares/azure.container.upload.middleware");
const {
  addFace,
  createFaceList,
  deleteFaceList,
  deleteFaceFromFaceList,
  getFaceLists,
  getFaceList,
  updateFaceList,
  getFaceListFace,
  trainFaceList
} = require("../service/face.list.large.service");

// create large facelist
router.post('/:largeFaceListId', upload.single('img'), uploadToAzure, async (req, res) => {

  const { userData, targetFace, azureId } = req.body;

  const { largeFaceListId } = req.params;
  
  const imageUrl = req.imgFileURL;

  const response = await addFace(largeFaceListId, userData, targetFace, imageUrl, azureId)

  if (response.error) {
    return res.status(response.status).json(response.message);
  }

  return res.json(response);
});


router.put('/:largeFaceListId', async (req, res) => {
  const {
    name,
    description,
    azureId
  } = req.body;

  const {
    largeFaceListId
  } = req.params;

  const response = await createFaceList(name, description, largeFaceListId, azureId);

  if (response.error) {
    return res.status(response.status).json(response.message);
  }

  return res.json({
    success: true
  });
});

router.delete('/:largeFaceListId', async (req, res) => {
  
  const { azureId } = req.body;
  const { largeFaceListId } = req.params;

  const response = await deleteFaceList(largeFaceListId, azureId);

  if (response.error) {
    return res.status(response.status).send(response.message);
  }

  res.json({success: true});
});

router.delete('/:largeFaceListId/:persistedFaceId', async (req, res) => {
  const { largeFaceListId, persistedFaceId } = req.params;
  const { azureId } = req.body;
  const response = await deleteFaceFromFaceList(largeFaceListId, persistedFaceId, azureId);

  if (response.error) {
    return res.status(response.status).send(response.message);
  }

  return res.json({success: true});
});

// filter the large face ids
router.get('/', async (req, res) => {
  const { azureId } = req.body;
  const { start, top } = req.params;

  const params = {
    start,
    top,
    returnRecognitionModel: true
  }

  const response = await getFaceLists(start, top, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

// get facelist data by id
router.get('/:largeFaceListId', async (req, res) => {
  const { largeFaceListId } = req.params;
  const { azureId } = req.body;
 
  const response = await getFaceList(largeFaceListId, azureId);

  if (response.error) {
    return res.status(response.status).send(response.message);
  }

  return res.json(response);
});

// get facelist face data
router.get('/:largeFaceListId/face', async (req, res) => {
  const { start, end, persistedFaceId, azureId } = req.body;
  const { largeFaceListId } = req.params;
  const response = await getFaceListFace(largeFaceListId, persistedFaceId, start, end, azureId);

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
  
  const response = await trainingStatusFaceList(largeFaceListId, azureId)

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
  const response = await trainFaceList(largeFaceListId, azureId);

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