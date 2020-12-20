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

  return await connectAPI(`facelists/${faceListId}/persistedFaces`, params, body, azureId, 'post');
}


async function createFaceList(name, description, faceListId, azureId){

  const body = {
    name,
    userData: description,
    recognitionModel: "recognition_03"
  }

  return await connectAPI(`facelists/${faceListId}`, {}, body, azureId, 'put');
}

async function deleteFaceList(faceListId, azureId){
  return await connectAPI(`facelists/${faceListId}`, {}, {}, azureId, 'delete');
}

async function deleteFaceFromFaceList(faceListId, persistedFaceId, azureId){
  return await connectAPI(`facelists/${faceListId}/persistedFaces/${persistedFaceId}`, {}, {}, azureId, 'delete');
}

async function getFaceList(faceListId, azureId) {
  const params = {
    returnRecognitionModel: true
  }
  return await connectAPI(`facelists/${faceListId}`, params, {}, azureId, 'get')
}

async function getFaceLists(azureId) {
  const params = {
    returnRecognitionModel: true
  }
  return await connectAPI(`facelists`, params, {}, azureId, 'get');
}

async function updateFaceList(faceListId, name = '', userData = '', azureId) {
  const body = {}

  if (name!=='') {
    body["name"] = name;
  }

  if(userData!==''){
    body.userData = userData;
  }

  return await connectAPI(`facelists/${faceListId}`, {}, body, azureId, 'patch');
}


module.exports = {
  addFace,
  createFaceList,
  deleteFaceList,
  deleteFaceFromFaceList,
  getFaceLists,
  getFaceList,
  updateFaceList
}
