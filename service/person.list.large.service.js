const connectAPI = require("./api.service");

// add face of person
async function addPersonFace(largePersonGroupId, personId, userData, targetFace = false, imageUrl, azureId) {
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

  return await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}/persistedFaces`, params, body, azureId, 'post');
}
// create person
async function createPerson(largePersonGroupId, name, userData, azureId) {
  const body = {
    name,
    userData,
  }
  return await connectAPI(`largepersongroups/${largePersonGroupId}/persons`, {}, body, azureId, 'post')
}
// delete person
async function deletePerson(personId, largePersonGroupId, azureId) {
  return await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}`, {}, {}, azureId, 'delete')
}
// delete the face of a person
async function deletePersonFace(persistedFaceId, personId, largePersonGroupId, azureId) {
  return await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'delete');
}
// get person meta data
async function getPersonDetails(largePersonGroupId, personId, azureId) {
  return await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}`, {}, {}, azureId, 'get');
}
// get face meta data
async function getPersonFaceDetails(persistedFaceId, largePersonGroupId, personId, azureId){
  return await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, {}, azureId, 'get');
}
// update person metadata
async function updatePerson(personId, largePersonGroupId, userData, azureId){
  const body = {
    userData
  }
  return await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}`, {}, body, azureId, 'patch')
}
// update face meta data
async function updatePersonFace(personId, largePersonGroupId, persistedFaceId,userData, azureId){
  const body = {
    userData
  }
  return  await connectAPI(`largepersongroups/${largePersonGroupId}/persons/${personId}/persistedfaces/${persistedFaceId}`, {}, body, azureId, 'patch');
}

// create large person list
async function createPersonList(name, userData, largePersonGroupId, azureId) {

  const body = {
    name,
    userData,
    recognitionModel: "recognition_03"
  }

  return await connectAPI(`largepersongroups/${largePersonGroupId}`, {}, body, azureId, 'put');
}
// delete large person list
async function deletePersonList(largePersonGroupId, azureId) {
  return await connectAPI(`largepersongroups/${largePersonGroupId}`, {}, {}, azureId, 'delete');
}
// get only one large person list
async function getPersonList(largePersonGroupId, start, top, azureId) {
  const params = {
    returnRecognitionModel: true
  }
  if (start){
    params.start = start;
  }

  if(top){
    params.top = top;
  }
  return await connectAPI(`largepersongroups/${largePersonGroupId}`, params, {}, azureId, 'get');
}
// get all large person lists with filters too
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
  return await connectAPI(`largepersongroups`, params, {}, azureId, 'get');
}
// get person training status
async function getPersonListTrainingStatus(largePersonGroupId, azureId) {
  return await connectAPI(`largepersongroups/${largePersonGroupId}/training`, {}, {}, azureId, 'get');
}
// train large person list
async function trainPersonList(largePersonGroupId, azureId) {
  return await connectAPI(`largepersongroups/${largePersonGroupId}/train`, {}, {}, azureId, 'post');
}

// update large person list meta data
async function updatePersonList(largePersonGroupId, name = '', userData = '', azureId) {
  const body = {}

  if (name !== '') {
    body["name"] = name;
  }

  if (userData !== '') {
    body.userData = userData;
  }

  return await connectAPI(`largepersongroups/${largePersonGroupId}`, {}, body, azureId, 'patch');
}

module.exports = {
  createPersonList,
  deletePersonList,
  getPersonLists,
  getPersonList,
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
  updatePersonFace
}
