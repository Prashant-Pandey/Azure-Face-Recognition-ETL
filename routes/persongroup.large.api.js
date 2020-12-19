const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const uploadToAzure = require("../middlewares/azure.container.upload.middleware");
const { createPersonList, deletePersonList, getPersonList, getPersonListTrainingStatus, getPersonLists, trainPersonList, updatePersonList, createPerson, addPersonFace, deletePerson, deletePersonFace,
  getPersonDetails, getPersonFaceDetails, updatePerson,
  updatePersonFace } = require("../service/person.list.large.service");

router.put('/:largePersonGroupId', async (req, res) => {
  const { name, userData, azureId } = req.body;
  const { largePersonGroupId } = req.params;


  const response = await createPersonList(name, userData, largePersonGroupId, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  return res.json(response);
});

router.delete('/:largePersonGroupId', async (req, res) => {
  const { azureId } = req.body;
  const { largePersonGroupId } = req.params;

  const response = await deletePersonList(largePersonGroupId, azureId);
  if (response.error) {
    return res.status(response.status).send(response);
  }

  return res.json({ success: true });
});
// delete face
router.delete('/:largePersonGroupId/:personId/:persistedFaceId', async (req, res) => {
  const { persistedFaceId, personId, largePersonGroupId } = req.params;
  const { azureId } = req.body;
  const response = await deletePersonFace(persistedFaceId, personId, largePersonGroupId, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  res.json({ success: true });
});
// delete person
router.delete('/:largePersonGroupId/:personId', async (req, res) => {
  const { azureId } = req.body;
  const { personId, largePersonGroupId } = req.params;

  const response = await deletePerson(personId, largePersonGroupId, azureId);
  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json({ success: true });
});

router.get('/:largePersonGroupId/train', async (req, res) => {
  const { azureId } = req.body;
  const { largePersonGroupId } = req.params
  const response = await getPersonListTrainingStatus(largePersonGroupId, azureId);
  if (response.error) {
    return res.status(response.status).send(response);
  }

  return res.json(response);
});
// get person data
router.get('/:largePersonGroupId/:personId', async (req, res) => {
  const { azureId } = req.body;
  const { largePersonGroupId, personId } = req.params
  const response = await getPersonDetails(largePersonGroupId, personId, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});
// get face details
router.get('/:largePersonGroupId/:personId/:persistedFaceId', async (req, res) => {
  const { azureId } = req.body;
  const { persistedFaceId, largePersonGroupId, personId } = req.params
  const response = await getPersonFaceDetails(persistedFaceId, largePersonGroupId, personId, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.get('/:largePersonGroupId', async (req, res) => {
  const { azureId } = req.body;
  const { largePersonGroupId, start, top } = req.params;
 
  const response = await getPersonList(largePersonGroupId, start, top, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  return res.json(response);
});

router.get('/', async (req, res) => {
  const {start, top} = req.params;
  const { azureId } = req.body;
  
  const response = await getPersonLists(start, top, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  return res.json(response);
});

router.post('/:largePersonGroupId', async (req, res) => {
  const {
    largePersonGroupId
  } = req.params;

  const response = await trainPersonList(largePersonGroupId, azureId);
  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json(response)
});
// create person
router.post('/:largePersonGroupId/person', async (req, res) => {
  const { name, userData, azureId } = req.body;
  const { largePersonGroupId } = req.params;

  const response = await createPerson(largePersonGroupId, name, userData, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});
// create person face
router.post('/:largePersonGroupId/:personId', upload.single('img'), uploadToAzure, async (req, res) => {
  const {
    userData,
    targetFace,
    azureId
  } = req.body;
  const imageUrl = req.imgFileURL;
  const { largePersonGroupId, personId } = req.params;

  const response = await addPersonFace(largePersonGroupId, personId, userData, targetFace, imageUrl, azureId);

  if (response.error) {
    return res.status(response.status).json(response);
  }

  return res.json(response);
});

router.patch('/:largePersonGroupId', async (req, res) => {
  const { name, userData, azureId } = req.body;
  const {
    largePersonGroupId
  } = req.params;

  const response = await updatePersonList(largePersonGroupId, name, userData, azureId);
  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  return res.json(response);
});

// update person details
router.patch('/:largePersonGroupId/:personId', async (req, res) => {
  const {
    userData,
    azureId
  } = req.body;

  const { personId, largePersonGroupId } = req.params;

  const response = await updatePerson(personId, largePersonGroupId, userData, azureId);
  if (response.error) {
    return res.status(response.status).json(response);
  }

  res.json(response)
});
// update face details
router.patch('/:largePersonGroupId/:personId/:persistedFaceId', async (req, res) => {
  const {
    userData,
    azureId
  } = req.body;

  const { largePersonGroupId, personId, persistedFaceId } = req.params;

  const response = await updatePersonFace(personId, largePersonGroupId, persistedFaceId, userData, azureId);
  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json(response)
});

module.exports = router;