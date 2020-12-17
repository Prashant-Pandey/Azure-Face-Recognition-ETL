const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const uploadToAzure = require("../middlewares/azure.container.upload.middleware");
const {
  addFace, createFaceList, 
  deleteFaceList, deleteFaceFromFaceList,
  getFaceLists, getFaceList, updateFaceList,
  trainingStatusFaceList, trainFaceList, getFaceListFace
} = require("../service/face.list.large.service");

// add a face to facelist
router.post('/:largeFaceListId/face', upload.single('img'), uploadToAzure, async (req, res) => {

  const { userData, targetFace, azureId } = req.body;

  const { largeFaceListId } = req.params;
  
  const imageUrl = req.imgFileURL;

  const response = await addFace(largeFaceListId, userData, targetFace, imageUrl, azureId)

  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json(response)
});

// train the facelist
router.post('/:largeFaceListId/train', async (req, res) => {

  const { largeFaceListId } = req.params;

  const response = await trainFaceList(largeFaceListId, azureId)

  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json({success: true})
});

// create facelist
router.put('/:largeFaceListId', async (req, res) => {
  const {
    azureId,
    name,
    description
  } = req.body;

  const {
    largeFaceListId
  } = req.params;

  const response = await createFaceList(name, description, largeFaceListId, azureId);

  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json({
    success: true
  })
});

// delete facelist
router.delete('/:largeFaceListId', async (req, res) => {

  const { azureId } = req.body;
  const { largeFaceListId } = req.params;

  const response = await deleteFaceList(largeFaceListId, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  res.json(response);
});

// delete face inside face list
router.delete('/:largeFaceListId/:persistedFaceId', async (req, res) => {
  const { largeFaceListId, persistedFaceId } = req.params;
  const { azureId } = req.body;
  const response = await deleteFaceFromFaceList(largeFaceListId, persistedFaceId, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

// get training status
router.get('/:largeFaceListId/train', async (req, res) => {
  const { azureId } = req.body;

  const response = await trainingStatusFaceList(largeFaceListId, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  res.json(response);
});

// get face data
router.get('/:largeFaceListId/:persistedFaceId', async (req, res) => {
  const { azureId } = req.body;
  const {largeFaceListId, persistedFaceId} = req.params;

  const response = await getFaceListFace(largeFaceListId, persistedFaceId, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  res.json(response);
});

// get facelist data
router.get('/:largeFaceListId', async (req, res) => {
  const { largeFaceListId } = req.params;
  const { start, top, azureId } = req.body;
 
  const response = await getFaceList(largeFaceListId, start, top, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  res.json(response);
});

// get face lists data
router.get('/', async (req, res) => {
  const { start, top, azureId } = req.body;

  const response = await getFaceLists(start, top, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  res.json(response);
});

// update facelist
router.patch('/:largeFaceListId', async (req, res) => {
  const {
    name,
    userData,
    azureId
  } = req.body;

  const {largeFaceListId} = req.params;

  const response = await updateFaceList(largeFaceListId, name, userData, azureId);
  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json(response)
});


module.exports = router;