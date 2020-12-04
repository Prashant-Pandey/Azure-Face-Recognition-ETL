# Azure-Face-Recognition-ETL
ETL API for Microsoft Azure Face Recognition to simplify the API Interface with a strong documentation

// image range: 36 x 36 to 4096 x 4096 px
// image size: 6 MB

faceRectangle: extract x and y coordinates of face

Age:
Emotion: happiness, sadness, neutral, anger, contempt, disgust, surprise, and fear
Exposure, noise and Blur: 0-1, if less exposed then picture is blur
Facial hairs presence, ignore length or decide something later
Gender: n, f, genderless
Hair: has hairs or not
Glasses: NoGlasses, ReadingGlasses, Sunglasses, and Swimming Goggles
Head pos: may be tilted [still deciding]
Emotion: only the ones which are one in it
Occlusion: blocking parts[ eyeOccluded, foreheadOccluded, and mouthOccluded ]
Smile: 0-1 [send a text for it]

Ocp-Apim-Subscription-Key = 1f1f44642d60497ab4ed3c169097f038
step #1: detect face # id = dc3a7510-a9a0-449d-9cfa-659e2880e53a
step #2: person group # id = friends-group
step #3: create person group person # person-id = c010f3f1-1ae3-42e6-b221-0b3bccf38a7e 
step #5: create and add face to the person # direct image url send -> # persistedFaceId: 678b77c9-6115-49c9-98a3-72c9365cedfe
step 5 must have only one image
test against -> https://i.pinimg.com/originals/27/27/44/27274483c7861355374b32330fcad289.jpg