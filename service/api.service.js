const { default: axios } = require("axios");
let subscriptionKey = process.env.AZURE_KEY1;
let endpoint = process.env.AZURE_ENDPOINT;
const connectAPI = async (service, params, body, azureId, method) => {
  try {
    const response = await axios({
      method: method,
      url: endpoint + service,
      params,
      data: body,
      headers: { 'Ocp-Apim-Subscription-Key': azureId || subscriptionKey }
    });
    return response.data;
  } catch (error) {
    const errorBody = {
      error: true,
      status: 400,
      message: error.message
    }
    if (error.response) {
      errorBody.status = error.response.status;
      errorBody.message = error.response.data.error;
    } else if (error.request) {
      errorBody.status = 500;
      errorBody.message = error.request;
    }

    return errorBody;
  }
}


module.exports = connectAPI;
