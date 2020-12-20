const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');

const azureStorageConnectionStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
const staticStorage = process.env.STATIC_FOLDER || "./uploads/"
const constainerName = process.env.STORAGE_CONTAINER || "azure-etl";

// middleware for uploading the files to azure
async function uploadToAzure(req, res, next) {
  try {
    // get the file from server
    const fileNames = req.imgFileName;
    if (!fileNames || fileNames.length === 0) {
      return next();
    }
    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i];
      const filePath = staticStorage + fileName;
      const file = await fs.readFileSync(filePath);
      // upload data to azure
      const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionStr);
      const containerClient = blobServiceClient.getContainerClient(constainerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      const uploadBlobResponse = await blockBlobClient.upload(file, file.length);
      // delete file from our space
      const deleteFile = await fs.unlinkSync(filePath);
      // setting up the file blob url
      if (!req.imgFileURL) {
        req.imgFileURL = [blockBlobClient.url]
      }else{
        req.imgFileURL = [...req.imgFileURL, blockBlobClient.url]
      }
    }

    if (req.imgFileURL.length===1) {
      req.imgFileURL = req.imgFileURL[0];
    }
    // going to next method in chain
    next();
  } catch (error) {
    // handling fs error
    if (error.code === 'ENOENT') {
      res.status(500).json({ error: error.message });
      return;
    }
    // handling all other errors
    res.status(500).json({ error: 'Storage service error' });
    return;
  }
}

module.exports = uploadToAzure;