const { default: axios } = require("axios");
var express = require("express");
require("dotenv").config();
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUI = require('swagger-ui-express')
var app = express();
var multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const imgName = Date.now() + file.originalname;
        req.imgFileName = imgName;
        cb(null, imgName);
    }
});

const fileFiler = (req, file, cb) => {
    // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/bmp') {
    //     cb(null, true);
    // }
    // cb(new Error('Please send either jpeg, jpg, png, gif or bmp'), false);
    cb(null, true);
}

var upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 6 },
    // fileFilter: fileFiler
});

let subscriptionKey = process.env.AZURE_KEY1
let endpoint = process.env.AZURE_ENDPOINT + '/face/v1.0/detect?';

app.use('/uploads', express.static('./uploads/'));

app.get('/', upload.single('img'), async (req, res) => {
    const fileName = req.imgFileName;
    const imageUrl = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/faces.jpg';
    // "http://localhost:4000/uploads/"+fileName
    console.log(fileName, {'url': "http://localhost:4000/uploads/"+fileName});
    const response = await axios({
        method: 'post',
        url: endpoint,
        params: {
            detectionModel: 'detection_01',
            returnFaceAttributes: 'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise',
            returnFaceId: true,
            returnFaceLandmarks: true,
            recognitionModel: 'recognition_03',
            returnRecognitionModel: true,
            
        },
        data: {
            url: imageUrl,
        },
        headers: { 'Ocp-Apim-Subscription-Key': subscriptionKey }
    });

    console.log('Status text: ' + response.status)
    console.log('Status text: ' + response.statusText)
    console.log(response.data)
    res.json(response.data);
});

// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             title: 'Company API',
//             version: '1.0.0',
//             description: 'API for company listing'
//         },
//         host: '0.0.0.0:4001',
//         basePath: '/'
//     },
//     apis: [
//         './index.js'
//     ]
// };

// const specs = swaggerJSDoc(swaggerOptions);

// app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(specs));

app.listen(4000, () => console.log('now graphql at localhost:4000'));
