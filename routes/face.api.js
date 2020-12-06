const router = require("express").Router();
const upload = require("../middlewares/image.middleware");
const connectAPI = require("../service/api.service");

router.post('/', upload.single('img'), async (req, res) => {
  const fileName = req.imgFileName;
  const imageUrl = 'https://i.pinimg.com/originals/27/27/44/27274483c7861355374b32330fcad289.jpg';
  const { azureId } = req.body;
  const params = {
    detectionModel: 'detection_01',
    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
    returnFaceId: true,
    returnFaceLandmarks: true,
    recognitionModel: 'recognition_03',
    returnRecognitionModel: true,
  }

  const body = {
    url: imageUrl,
  }

  const response = await connectAPI('detect', params, body, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.post('/similar', async (req, res) => {
  const {
    faceId,
    largeFaceListId,
    maxFaceLimit,
    mode,
    azureId
  } = req.body;

  const body = {
    faceId,
    largeFaceListId,
    "maxNumOfCandidatesReturned": maxFaceLimit,
    mode
  }

  const response = await connectAPI('findsimilars', {}, body, azureId, 'post');
  if (response.error) {
    res.status(response.status).json(response.message);
    return;
  }

  res.json(response)
});

router.post('/group', async (req, res) => {
  console.log(req.body);
  const { faceIds, azureId } = req.body;

  const body = { faceIds };

  const response = await connectAPI('group', {}, body, azureId, 'post');
  console.log(response.error);
  if (response.error) {
    res.status(response.status);
    res.send(response.message);
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