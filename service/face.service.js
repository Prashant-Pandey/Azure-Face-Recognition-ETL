const connectAPI = require("./api.service");
const largeFaceListService = require("./face.list.large.service")
const faceListService = require("./face.list.service")
const personListService = require("./person.list.service");
const largePersonListService = require("./person.list.large.service");

async function createMessyGroup(faceIds, azureId) {
  const body = { faceIds };
  return await connectAPI('group', {}, body, azureId, 'post');
}

async function verify(faceId, personId, largePersonGroupId, faceId1, faceId2, face1Url, face2Url, azureId) {
  if (faceId && personId) {
    // face to person verification
    return await faceToPersonVerification(faceId, personId, largePersonGroupId, azureId);
  } else if (faceId1 && faceId2) {
    // face to face verification
    return await faceIdToFaceIdVerification(faceId1, faceId2, azureId);
  } else if (face1Url && face2Url) {
    return await faceTofaceVerification(face1Url, face2Url, azureId);
  } else {
    return {
      error: true,
      status: 400,
      message: 'Please provide appropriate faceIds or personId or largePersonGroupId'
    }
  }
}

async function faceTofaceVerification(face1Url, face2Url, azureId) {
  // detect faces and get the faceIds
  const faceId1 = await getFaceIdOnly(face1Url, azureId);
  const faceId2 = await getFaceIdOnly(face2Url, azureId);
  if (faceId1.error || faceId2.error) {
    return faceId1.error || faceId2.error;
  }
  // then get all the images and use verify 
  return await faceIdToFaceIdVerification(faceId1[0].faceId, faceId2[0].faceId, azureId);
}

async function faceIdToFaceIdVerification(faceId1, faceId2, azureId) {
  const body = { faceId1, faceId2 };
  return await connectAPI('verify', {}, body, azureId, 'post');
}

async function faceToPersonVerification(faceId, personId, largePersonGroupId, azureId) {
  const body = { faceId, personId, largePersonGroupId };
  return await connectAPI('verify', {}, body, azureId, 'post');
}

async function indentifyFaces(imgUrls, faceIds, personGroupId, largePersonGroupId, maxFaceLimit, confidenceThreshold, azureId) {
  let toBeMatchFaceId = []
  if (imgUrls && imgUrls.length > 0) {
    // get faceids of all
    for (let i = 0; i < imgUrls.length; i++) {
      const faceDetect = await getFaceIdOnly(imgUrls[i], azureId);
      if (faceDetect.error) {
        return faceDetect;
      }
      toBeMatchFaceId.push(faceDetect[0].faceId);
    }
  } else {
    toBeMatchFaceId = faceIds;
  }

  if (personGroupId || largePersonGroupId) {
    return await fetchIdentifyFaces(toBeMatchFaceId, personGroupId, largePersonGroupId, maxFaceLimit, confidenceThreshold, azureId)
  }

  // get personGroupId
  const personGroups = personListService.getPersonLists('', '', azureId);
  for (let i = 0; i < personGroups.length; i++) {
    // check for each person group
    const personGroupIdTmp = personGroups[i].personGroupId;
    const indentifiedface = await fetchIdentifyFaces(toBeMatchFaceId, personGroupIdTmp, largePersonGroupId, maxFaceLimit, confidenceThreshold, azureId);
    if (!indentifiedface.error) {
      return indentifiedface;
    }
  }
  // get largePersonGroupId
  const largePersonGroups = largePersonListService.getPersonLists('','',azureId);
  for (let i = 0; i < largePersonGroups.length; i++) {
    // check for each person group
    const largePersonGroupIdTmp = largePersonGroups[i].personGroupId;
    const indentifiedface = await fetchIdentifyFaces(toBeMatchFaceId, personGroupId, largePersonGroupIdTmp, maxFaceLimit, confidenceThreshold, azureId);
    if (!indentifiedface.error) {
      return indentifiedface;
    }
  }

  return [];
}

async function fetchIdentifyFaces(faceIds, personGroupId, largePersonGroupId, maxFaceLimit, confidenceThreshold, azureId) {
  const body = {
    faceIds
  };

  if (personGroupId) {
    body.personGroupId = personGroupId;
  }

  if (largePersonGroupId) {
    body.largePersonGroupId = largePersonGroupId;
  }

  if (maxFaceLimit) {
    body.maxNumOfCandidatesReturned = maxFaceLimit;
  }

  if (confidenceThreshold) {
    body.confidenceThreshold = confidenceThreshold;
  }

  return await connectAPI('identify', {}, body, azureId, 'post');
}

async function getSimilarFaces(imageUrl, faceId, faceListId, largeFaceListId, faceIds, maxFaceLimit, mode, azureId) {
  if (!imageUrl) {
    // then no image uploaded
    if (!faceId || (!largeFaceListId && !faceListId && !faceIds)) {
      return {
        error: true,
        status: 400,
        message: 'Please either send face id and (large face list id or face list id or face ids array) or upload the image.'
      }
    }

    let matchId, type;
    if (largeFaceListId) {
      matchId = largeFaceListId;
      type = "largeFaceListId";
    }

    if (faceListId) {
      matchId = faceListId;
      type = "faceListId";
    }

    if (faceIds) {
      matchId = faceIds;
      type = "faceIds";
    }

    return await fetchSimilarFaces(faceId, matchId, type, maxFaceLimit, mode, azureId);
  } else {
    if (!imageUrl) {
      return {
        error: true,
        status: 400,
        message: 'Please either send face id and large face list id or upload the image.'
      }
    }

    // detect face and get the faceid only
    const faceDetect = await getFaceIdOnly(imageUrl, azureId);

    if (faceDetect.length > 1 || faceDetect.length === 0) {
      return {
        error: true,
        status: 400,
        message: 'Please send a image of a single person.'
      }
    }

    if (faceDetect.error) {
      return faceDetect;
    }

    const faceId = faceDetect[0].faceId;

    // check for all largest faceIds
    const largeFaceLists = await largeFaceListService.getFaceLists();
    for (let i = 0; i < largeFaceLists.length; i++) {
      const largeFaceListId = largeFaceLists[i].largeFaceListId;
      // check if any list is trained and if the face is similar to the face.
      const matchRes = await fetchSimilarFaces(faceId, largeFaceListId, "largeFaceListId", maxFaceLimit, mode, azureId);
      if (!matchRes.error) {
        return matchRes;
      }

    }

    const faceLists = await faceListService.getFaceLists();

    for (let i = 0; i < faceLists.length; i++) {
      const faceListId = faceLists[i].faceListId;
      // check if any list is trained and if the face is similar to the face.
      const matchRes = await fetchSimilarFaces(faceId, faceListId, "faceListId", maxFaceLimit, mode, azureId);
      if (!matchRes.error) {
        return matchRes;
      }

    }

    return [];
  }

}

// get similar faces from api, only contains fetching data from api
async function fetchSimilarFaces(faceId, matchId, matchIdType, maxFaceLimit, mode, azureId) {
  const body = {
    faceId,
  }

  if (maxFaceLimit) {
    body["maxNumOfCandidatesReturned"] = maxFaceLimit;

  }

  if (mode) {
    body.mode = mode;
  }

  if (matchIdType === "largeFaceListId") {
    body.largeFaceListId = matchId;
  }
  if (matchIdType === "faceListId") {
    body.faceListId = matchId;
  }
  if (matchIdType === "faceIds") {
    body.faceIds = matchId;
  }

  return await connectAPI('findsimilars', {}, body, azureId, 'post');
}

async function getFaceIdOfExistingFaces() {

}

async function getFaceIdOnly(imageUrl, azureId) {
  return await faceDetectionAPI(imageUrl, azureId, '', true, false, false, true);
}

async function generateReturnFaceAttribute(features = false, noises = false, emotions = false, characterstics = false) {

  if (!features && !emotions && !characterstics && !noises) {
    return 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise';
  }

  let returnStr = '';

  if (features) {
    returnStr += 'headPose,glasses,facialHair,makeup,accessories,hair,';
  }

  if (noises) {
    returnStr += 'occlusion,exposure,noise,blur,';
  }

  if (emotions) {
    returnStr += 'smile,emotion,';
  }

  if (characterstics) {
    returnStr += 'age,gender,'
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
  getFaceDetection,
  getLimitedFaceDetection,
  getSimilarFaces,
  createMessyGroup,
  indentifyFaces,
  verify
}
