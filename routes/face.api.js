const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const uploadToAzure = require("../middlewares/azure.container.upload.middleware");
const connectAPI = require("../service/api.service");
const { getFaceDetection, getLimitedFaceDetection, getSimilarFaces } = require("../service/face.service")

router.post('/', upload.single('img'), uploadToAzure, async (req, res) => {
  try {
    console.log(req.body, 'inside the function');
    // check input 
    const { location, features, landmark, emotions, characterstics, noises, azureId } = req.body;
    // create params for the azure face api
    const imageUrl = req.imgFileURL;

    if (!location && !features && !landmark && !emotions && !characterstics && !noises) {
      return res.json(await getFaceDetection(imageUrl, azureId));
    }

    return res.json(await getLimitedFaceDetection(imageUrl, azureId, location, landmark, features, noises, emotions, characterstics));

  } catch (error) {

    if (error.code === 'ENOENT') {
      return res.status(500).json({ error: error.message });
    }

    if (!error.status) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(error.status).json(error.message);
  }
});

router.post(
  '/similar',
  upload.single('img'),
  uploadToAzure,
  async (req, res) => {
    const {
      faceId,
      faceListId,
      largeFaceListId,
      faceIds,
      maxFaceLimit,
      mode,
      azureId
    } = req.body;

    const imageUrl = req.imgFileURL;

    const response = await getSimilarFaces(imageUrl, faceId, faceListId, largeFaceListId, faceIds, maxFaceLimit, mode, azureId);

    if (response.error) {
      return res.status(response.status).send(response);
    }

    return res.json(response);
  }
);

router.post('/group', async (req, res) => {
  console.log(req.body);
  const { faceIds, azureId } = req.body;

  const body = { faceIds };

  const response = await connectAPI('group', {}, body, azureId, 'post');

  if (response.error) {
    res.status(response.status).send(response);
    return;
  }

  res.json(response);
});

router.post('/identify', async (req, res) => {
  const { largePersonGroupId, faceIds, maxFaceLimit, confidenceThreshold, azureId } = req.body;
  const body = { largePersonGroupId, faceIds, maxNumOfCandidatesReturned: maxFaceLimit, confidenceThreshold }
  const response = await connectAPI('identify', {}, body, azureId, 'post');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});

router.post('/verify', async (req, res) => {
  const { faceId, personId, largePersonGroupId, azureId, faceId1, faceId2 } = req.body;
  let body = {}
  if (faceId1 && faceId2) {
    body = {
      faceId1,
      faceId2
    }
  } else {
    body = {
      largePersonGroupId,
      faceIds,
      "maxNumOfCandidatesReturned": maxFaceLimit,
      confidenceThreshold
    }
  }

  const response = await connectAPI('verify', {}, body, azureId, 'post');

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});


module.exports = router;