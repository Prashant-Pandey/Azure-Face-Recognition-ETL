const multer = require('multer');
const staticStorage = process.env.STATIC_FOLDER || "./uploads/";

// store the file data to the static folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, staticStorage);
  },
  filename: (req, file, cb) => {
    const imgName = Date.now() + file.originalname;
    if (!req.imgFileName) {
      req.imgFileName = [imgName]
    }else{
      req.imgFileName = [...req.imgFileName, imgName]
    }
    cb(null, imgName);
  }
});

// filter the files to be uploaded
const fileFiler = (req, file, cb) => {
  // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/bmp') {
  //     cb(null, true);
  // }
  // cb(new Error('Please send either jpeg, jpg, png, gif or bmp'), false);
  cb(null, true);
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 6 },
  // fileFilter: fileFiler
});

module.exports = upload;