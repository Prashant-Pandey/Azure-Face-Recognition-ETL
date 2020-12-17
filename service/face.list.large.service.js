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

async function getFaceList(faceListId, azureId) {
  const params = {
    returnRecognitionModel: true
  }
  return await connectAPI(`largefacelists/${faceListId}`, params, {}, azureId, 'get')
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

async function getFaceListFace(largeFaceListId, persistedFaceId = '', start = '', top = '', azureId) {

  const params = {}
  let requestURL = `largefacelists/${largeFaceListId}/persistedfaces`
  if (persistedFaceId !== '') {
    requestURL += `/${persistedFaceId}`
  } else {
    if (start !== '') {
      params["start"] = start;
    }

    if (top !== '') {
      params["top"] = top;
    }
  }

  return await connectAPI(requestURL, params, {}, azureId, 'get');

}

async function trainFaceList(largeFaceListId, azureId) {
  return await connectAPI(
    `largefacelists/${largeFaceListId}/training`,
    {}, {}, azureId,
    'post'
  );
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
  getFaceList,
  updateFaceList,
  getFaceListFace,
  trainFaceList,
  trainingStatusFaceList
}
