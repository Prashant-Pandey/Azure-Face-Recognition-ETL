const connectAPI = require("./api.service");

async function addPersonFace(personGroupId, personId, userData, targetFace = false, imageUrl, azureId) {
  const params = {
    userData,
    detectionModel: 'detection_01',
  }

  if (targetFace) {
    params.targetFace = targetFace;
  }

  const body = {
    url: imageUrl
  }

  return await connectAPI(`persongroups/${personGroupId}/persons/${personId}/persistedFaces`, params, body, azureId, 'post');
}

async function createPerson(personGroupId, name, userData, azureId) {
  const body = {
    name,
    userData,
  }
  return await connectAPI(`persongroups/${personGroupId}/persons`, {}, body, azureId, 'post')
}

async function deletePerson(personId, personGroupId, azureId) {
  return await connectAPI(`persongroups/${personGroupId}/persons/${personId}`, {}, {}, azureId, 'delete')
}

async function deletePersonFace(persistedFaceId, personId, personGroupId, azureId) {
  return await connectAPI(`persongroups/${personGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'delete');
}

async function getPersonDetails(personGroupId, personId, azureId) {
  return await connectAPI(`persongroups/${personGroupId}/persons/${personId}`, {}, {}, azureId, 'get');
}

async function getPersonFaceDetails(persistedFaceId, personGroupId, personId, azureId){
  return await connectAPI(`persongroups/${personGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'get');
}

async function getPersonListTrainingStatus(personGroupId, azureId) {
  return await connectAPI(`persongroups/${personGroupId}/training`, {}, {}, azureId, 'get');
}

async function createPersonList(name, userData, personGroupId, azureId) {

  const body = {
    name,
    userData,
    recognitionModel: "recognition_03"
  }

  return await connectAPI(`persongroups/${personGroupId}`, {}, body, azureId, 'put');
}

async function deletePersonList(personGroupId, azureId) {
  return await connectAPI(`persongroups/${personGroupId}`, {}, {}, azureId, 'delete');
}

async function deleteFaceFromFaceList(faceListId, persistedFaceId, azureId) {
  return await connectAPI(`facelists/${faceListId}/persistedFaces/${persistedFaceId}`, {}, {}, azureId, 'delete');
}

async function getPersonListMetaData(personGroupId, azureId) {
  const params = {
    returnRecognitionModel: true
  }

  return await connectAPI(`persongroups/${personGroupId}`, {}, {}, azureId, 'get');
}

async function getPersonListFaces(personGroupId, start, top, azureId){
  const params = {
    returnRecognitionModel: true
  }

  if (start) {
    params.start = start;
  }

  if (top) {
    params.top = top;
  }

  return await connectAPI(`persongroups/${personGroupId}/persons`, params, {}, azureId, 'get');
}

async function getPersonLists(start='', top='', azureId) {
  const params = {
    returnRecognitionModel: true
  }

  if (start&&start!=='') {
    params.start = start;
  }

  if (top&&top!=='') {
    params.top = top;
  }
  return await connectAPI(`persongroups`, params, {}, azureId, 'get');
}

async function trainPersonList(personGroupId, azureId) {
  return await connectAPI(`persongroups/${personGroupId}/train`, {}, {}, azureId, 'post');
}

async function trainAllPersonList(azureId) {
  const personLists = await getPersonLists();
  let trainResponseError = [];
  for (let i = 0; i < personLists.length; i++) {
    const personListRes = await connectAPI(`persongroups/${personLists[i].personGroupId}/train`, {}, {}, azureId, 'post');
    if (personListRes.error) {
      trainResponseError.push({
        personGroupId: personLists[i].personGroupId,
        error: personListRes
      })
    }
  }

  return trainResponseError;
}

async function updatePersonList(personGroupId, name = '', userData = '', azureId) {
  const body = {}

  if (name !== '') {
    body["name"] = name;
  }

  if (userData !== '') {
    body.userData = userData;
  }

  return await connectAPI(`persongroups/${personGroupId}`, {}, body, azureId, 'patch');
}

async function updatePerson(personId, personGroupId, userData, azureId){
  const body = {
    userData
  }
  return await connectAPI(`persongroups/${personGroupId}/persons/${personId}`, {}, body, azureId, 'patch')
}

async function updatePersonFace(personId, personGroupId, persistedFaceId,userData, azureId){
  const body = {
    userData
  }
  return  await connectAPI(`persongroups/${personGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, body, azureId, 'patch');
}


module.exports = {
  createPersonList,
  deletePersonList,
  deleteFaceFromFaceList,
  getPersonLists,
  getPersonListMetaData,
  getPersonListFaces,
  getPersonListTrainingStatus,
  trainPersonList,
  updatePersonList,
  createPerson,
  addPersonFace,
  deletePerson,
  deletePersonFace,
  getPersonDetails,
  getPersonFaceDetails,
  updatePerson,
  updatePersonFace,
  trainAllPersonList
}
