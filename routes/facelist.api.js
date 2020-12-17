const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const uploadToAzure = require("../middlewares/azure.container.upload.middleware");
const {
  addFace, createFaceList, 
  deleteFaceList, deleteFaceFromFaceList,
  getFaceLists, getFaceList, updateFaceList
} = require("../service/face.list.service");

// add a face to facelist
router.post('/:faceListId/face', upload.single('img'), uploadToAzure, async (req, res) => {

  const { userData, targetFace, azureId } = req.body;

  const { faceListId } = req.params;
  
  const imageUrl = req.imgFileURL;

  const response = await addFace(faceListId, userData, targetFace, imageUrl, azureId)

  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

// create facelist
router.put('/:faceListId', async (req, res) => {
  const {
    azureId,
    name,
    description
  } = req.body;

  const {
    faceListId
  } = req.params;

  const response = await createFaceList(name, description, faceListId, azureId);

  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json({
    success: true
  })
});

// delete facelist
router.delete('/:faceListId', async (req, res) => {

  const { azureId } = req.body;
  const { faceListId } = req.params;

  const response = await deleteFaceList(faceListId, azureId);

  if (response.error) {
    return res.status(response.status).send(response.message);
  }

  res.json(response);
});

// delete face inside face list
router.delete('/:faceListId/:persistedFaceId', async (req, res) => {
  const { faceListId, persistedFaceId } = req.params;
  const { azureId } = req.body;
  const response = await deleteFaceFromFaceList(faceListId, persistedFaceId, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

// get facelist data
router.get('/:faceListId', async (req, res) => {
  const { faceListId } = req.params;
  const { azureId } = req.body;
 
  const response = await getFaceList(faceListId, azureId);

  if (response.error) {
    return res.status(response.status).send(response.message);
  }

  res.json(response);
});

// get face lists data
router.get('/', async (req, res) => {
  const { azureId } = req.body;

  const response = await getFaceLists(azureId);

  if (response.error) {
    return res.status(response.status).send(response.message);
  }

  res.json(response);
});

// update facelist
router.patch('/:faceListId', async (req, res) => {
  const {
    name,
    userData,
    azureId
  } = req.body;

  const {faceListId} = req.params;

  const response = await updateFaceList(faceListId, name, userData, azureId);
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});


module.exports = router;