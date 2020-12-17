const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const uploadToAzure = require("../middlewares/azure.container.upload.middleware");
const { createPersonList, deletePersonList, getPersonList, getPersonListTrainingStatus, getPersonLists, trainPersonList, updatePersonList, createPerson, addPersonFace, deletePerson, deletePersonFace,
  getPersonDetails, getPersonFaceDetails, updatePerson,
  updatePersonFace } = require("../service/person.list.service");

router.post('/:personGroupId/train', async (req, res) => {
  const {
    azureId
  } = req.body;

  const { personGroupId } = req.params;

  const response = await trainPersonList(personGroupId, azureId);
  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json({ success: true })
});
// create person
router.post('/:personGroupId/person', async (req, res) => {
  const { name, userData, azureId } = req.body;
  const { personGroupId } = req.params;

  const response = await createPerson(personGroupId, name, userData, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});
// create person face
router.post('/:personGroupId/:personId', upload.single('img'), uploadToAzure, async (req, res) => {
  const {
    userData,
    targetFace,
    azureId
  } = req.body;
  const imageUrl = req.imgFileURL;
  const { personGroupId, personId } = req.params;

  const response = await addPersonFace(personGroupId, personId, userData, targetFace, imageUrl, azureId);

  if (response.error) {
    return res.status(response.status).json(response);
  }

  return res.json(response);
});

router.delete('/:personGroupId/:personId/:persistedFaceId', async (req, res) => {
  const { persistedFaceId, personId, personGroupId } = req.params;
  const { azureId } = req.body;
  const response = await deletePersonFace(persistedFaceId, personId, personGroupId, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  res.json({ success: true });
});

router.delete('/:personGroupId/:personId', async (req, res) => {
  const { azureId } = req.body;
  const { personId, personGroupId } = req.params;

  const response = await deletePerson(personId, personGroupId, azureId);
  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json({ success: true });
});

router.delete('/:personGroupId', async (req, res) => {
  const { azureId } = req.body;
  const { personGroupId } = req.params;

  const response = await deletePersonList(personGroupId, azureId);
  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  return res.json({ success: true });
});

router.get('/', async (req, res) => {
  const { azureId, start, top } = req.body;

  const response = await getPersonLists(start, top, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.get('/:personGroupId', async (req, res) => {
  const { azureId } = req.body;
  const { personGroupId, start, top } = req.params

  const response = await getPersonList(personGroupId, start, top, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.get('/:personGroupId/train', async (req, res) => {
  const { azureId } = req.body;
  const { personGroupId } = req.params
  const response = await getPersonListTrainingStatus(personGroupId, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.get('/:personGroupId/:personId', async (req, res) => {
  const { azureId } = req.body;
  const { personGroupId, personId } = req.params
  const response = await getPersonDetails(personGroupId, personId, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.get('/:personGroupId/:personId/:persistedFaceId', async (req, res) => {
  const { azureId } = req.body;
  const { persistedFaceId, personGroupId, personId } = req.params
  const response = await getPersonFaceDetails(persistedFaceId, personGroupId, personId, azureId);

  if (response.error) {
    res.status(response.status);
    res.send(response);
    return;
  }

  res.json(response);
});

router.put('/:personGroupId', async (req, res) => {
  const { azureId, name, userData } = req.body;
  const { personGroupId } = req.params;

  const response = await createPersonList(name, userData, personGroupId, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  return res.json({ success: true });
});

router.patch('/:personGroupId', async (req, res) => {
  const {
    name,
    userData,
    azureId
  } = req.body;

  const { personGroupId } = req.params;

  const response = await updatePersonList(personGroupId, name, userData, azureId);
  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json(response)
});

router.patch('/:personGroupId/:personId', async (req, res) => {
  const {
    userData,
    azureId
  } = req.body;

  const { personId, personGroupId } = req.params;

  const response = await updatePerson(personId, personGroupId, userData, azureId);
  if (response.error) {
    return res.status(response.status).json(response);
  }

  res.json(response)
});

router.patch('/:personGroupId/:personId/:persistedFaceId', async (req, res) => {
  const {
    userData,
    azureId
  } = req.body;

  const { personGroupId, personId, persistedFaceId } = req.params;

  const response = await updatePersonFace(personId, personGroupId, persistedFaceId, userData, azureId);
  if (response.error) {
    res.status(response.status).json(response);
    return;
  }

  res.json(response)
});



module.exports = router;