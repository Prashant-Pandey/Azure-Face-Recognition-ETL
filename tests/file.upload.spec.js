const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');


const azureStorageConnectionStr = 'DefaultEndpointsProtocol=https;AccountName=itis6177;AccountKey=ZoS4EeJ4KkSyPmRrU2FxOX44WDsvCrkCGdtfzCBcJGqM4JQ+onNMjXpdJSAE7YWlHZr3pkV5Q0BboflgUw+2lw==;EndpointSuffix=core.windows.net';

const file = fs.readFile('./testing_photos/tom_holland_1.jpg', async (err, data) => {
  if (!err) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(azureStorageConnectionStr);
    const containerClient = blobServiceClient.getContainerClient("azure-etl");
    const blockBlobClient = containerClient.getBlockBlobClient("tom_holland_1.jpg");
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    // var blobUrl = blockBlobClient.Uri.AbsoluteUri;
    console.log(uploadBlobResponse);
    console.log('url: ', );
  }

  console.log('error: ', err);
});