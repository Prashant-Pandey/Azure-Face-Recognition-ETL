const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const uploadToAzure = require("../middlewares/azure.container.upload.middleware");
const connectAPI = require("../service/api.service");
const {
  getFaceDetection, getLimitedFaceDetection,
  getSimilarFaces, createMessyGroup,
  indentifyFaces, verify
} = require("../service/face.service")

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

router.post( '/similar',
  upload.any('img'),
  uploadToAzure,
  async (req, res) => {
    const {
      faceId,
      faceListId,
      largeFaceListId,
      faceIds,
      personGroupId,
      largePersonGroupId,
      maxFaceLimit,
      mode,
      azureId
    } = req.body;

    const imageUrl = req.imgFileURL;
    let response;

    if ((typeof imageUrl !== 'string' && imageUrl.length > 1)|| (personGroupId||largePersonGroupId)) {
      // image url can be array
      response = await indentifyFaces(imageUrl, faceIds, personGroupId, largePersonGroupId, maxFaceLimit, mode, azureId);
    }else{
      response = await getSimilarFaces(imageUrl, faceId, faceListId, largeFaceListId, faceIds, maxFaceLimit, mode, azureId);
    }

    if (response.error) {
      return res.status(response.status).send(response);
    }

    return res.json(response);
  }
);

router.post('/group', async (req, res) => {

  const { faceIds, azureId } = req.body;

  const response = await createMessyGroup(faceIds, azureId);

  if (response.error) {
    return res.status(response.status).send(response);
  }

  return res.json(response);
});

router.post('/verify', upload.any('img'), uploadToAzure, async (req, res) => {
  const { faceId, personId, largePersonGroupId, azureId, faceId1, faceId2 } = req.body;
  const [face1Url, face2Url] = req.imgFileURL;

  const response = await verify(
    faceId, personId, largePersonGroupId,
    faceId1, faceId2, 
    face1Url, face2Url, 
    azureId
  );

  if (response.error) {
    res.status(response.status);
    res.send(response.message);
    return;
  }

  res.json(response);
});


module.exports = router;