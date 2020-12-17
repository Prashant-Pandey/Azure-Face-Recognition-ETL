const connectAPI = require("./api.service");

async function getFaceIdOfExistingFaces() {

}

async function getFaceIdOfNewFaces(imageUrl) {

}

async function generateReturnFaceAttribute(features = false, noises = false, emotions = false, characterstics = false) {

  if (!features && !emotions && !characterstics && !noises) {
    return 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise';
  }

  let returnStr = '';

  if (features) {
    returnStr += 'headPose,glasses,facialHair,blur,makeup,accessories,hair,';
  }

  if (noises) {
    returnStr += 'occlusion,exposure,noise,';
  }

  if (emotions) {
    returnStr += 'smile,emotion,';
  }

  if (characterstics) {
    returnStr += 'age,gender'
  }

  return returnStr.substr(0, returnStr.length - 1);

}


async function getLimitedFaceDetection(imageUrl, azureId, location, landmark, features, noises, emotions, characterstics) {
  const face = faceDetectionAPI(imageUrl, azureId, await generateReturnFaceAttribute(features, noises, emotions, characterstics), true, landmark, true, true);

  if (!location && face.faceRectangle) {
    delete face.faceRectangle
  }
  return face;
}

async function faceDetectionAPI(imageUrl, azureId, returnFaceAttributes = '', returnFaceId = false, returnFaceLandmarks = false, detection = false, recognition = false) {
  const params = {
    returnFaceAttributes,
    returnFaceId,
    returnFaceLandmarks,
  }

  if (detection) {
    params.detectionModel = 'detection_01';
  }

  if (recognition) {
    params.recognitionModel = 'recognition_03';
    params.returnRecognitionModel = true;
  }

  const body = {
    url: imageUrl,
  }

  const faces = await connectAPI('detect', params, body, azureId, 'post');

  return faces;
}

async function getFaceDetection(imageUrl, azureId) {
  return faceDetectionAPI(imageUrl, azureId, await generateReturnFaceAttribute(), true, true, true, true);
}

module.exports = {
  getFaceIdOfExistingFaces,
  getFaceIdOfNewFaces,
  getFaceDetection,
  getLimitedFaceDetection
}
