const connectAPI = require("./api.service");
async function addFace(faceListId, userData, targetFace = false, imageUrl, azureId) {
  const params = {
    userData,
    detectionModel: "detection_01"
  }

  if (targetFace) {
    params.targetFace = targetFace;
  }

  const body = {
    url: imageUrl
  }

  return await connectAPI(`largefacelists/${faceListId}/persistedFaces`, params, body, azureId, 'post');
}

async function createFaceList(name, description, faceListId, azureId) {

  const body = {
    name,
    userData: description,
    recognitionModel: "recognition_03"
  }

  return await connectAPI(`largefacelists/${faceListId}`, {}, body, azureId, 'put');
}

async function deleteFaceList(faceListId, azureId) {
  return await connectAPI(`largefacelists/${faceListId}`, {}, {}, azureId, 'delete');
}

async function deleteFaceFromFaceList(faceListId, persistedFaceId, azureId) {
  return await connectAPI(`largefacelists/${faceListId}/persistedFaces/${persistedFaceId}`, {}, {}, azureId, 'delete');
}

async function getFaceListMetaData(faceListId, azureId) {
  const params = {
    returnRecognitionModel: true
  }

  return await connectAPI(`largefacelists/${faceListId}`, params, {}, azureId, 'get')
}

async function getFaceListFaceData(faceListId, start, top, azureId) {
  const params = {
    returnRecognitionModel: true
  }

  if (start) {
    params['start'] = start;
  }

  if(top){
    params["top"] = top;
  }

  return await connectAPI(`largefacelists/${faceListId}/persistedfaces`, params, {}, azureId, 'get')
}

async function getFaceLists(start = '', top = 0, azureId) {
  const params = {
    returnRecognitionModel: true
  }

  if (start !== '') {
    params["start"] = start;
  }

  if (top !== 0) {
    params["top"] = top;
  }

  return await connectAPI(`largefacelists`, params, {}, azureId, 'get');
}

async function updateFaceList(faceListId, name = '', userData = '', azureId) {
  const body = {}

  if (name !== '') {
    body["name"] = name;
  }

  if (userData !== '') {
    body.userData = userData;
  }

  return await connectAPI(`largefacelists/${faceListId}`, {}, body, azureId, 'patch');
}

async function getFaceListFace(largeFaceListId, persistedFaceId, azureId) {
  let requestURL = `largefacelists/${largeFaceListId}/persistedfaces/${persistedFaceId}`
  return await connectAPI(requestURL, {}, {}, azureId, 'get');

}

async function trainFaceList(largeFaceListId, azureId) {
  return await connectAPI(
    `largefacelists/${largeFaceListId}/train`,
    {}, {}, azureId,
    'post'
  );
}

async function trainAllFaceList(azureId) {
  const largeFaceList = await getFaceLists();
  let trainResponseError = [];
  
  for (let i = 0; i < largeFaceList.length; i++) {
    const largeFaceListRes = await connectAPI(
      `largefacelists/${largeFaceList[i].largeFaceListId}/train`,
      {}, {},
      azureId,
      'post'
    );
    if (largeFaceListRes.error) {
      trainResponseError.push({
        personGroupId: largeFaceList[i].largePersonGroupId,
        error: largeFaceListRes
      })
    }
  }

  return trainResponseError;
}

async function trainingStatusFaceList(largeFaceListId, azureId) {
  return await connectAPI(
    `largefacelists/${largeFaceListId}/training`,
    {}, {}, azureId,
    'get'
  );
}

module.exports = {
  addFace,
  createFaceList,
  deleteFaceList,
  deleteFaceFromFaceList,
  getFaceLists,
  getFaceListFaceData,
  getFaceListMetaData,
  updateFaceList,
  getFaceListFace,
  trainFaceList,
  trainingStatusFaceList,
  trainAllFaceList
}
