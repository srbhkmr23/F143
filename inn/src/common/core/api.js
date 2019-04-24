import axios from 'axios';

import ApiJson from './api-json';
import Config from './config';

import {
  handleApiError,
  showSuccessToast,
  getCookie,
  removeCookie
} from './common-functions';

let apiFailCounter = 0;

axios.defaults.baseURL = Config.API_URL_JAVA;
let NodeAPIURL = Config.API_URL_Node;
// axios.defaults.baseURL = 'http://103.76.253.133:8582';
// axios.defaults.baseURL = 'http://172.16.0.90:8582';

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    let userInfo = getCookie('userInfo');
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      if (userInfo.access_token) {
        let access_token = userInfo.access_token;
        config.headers.Authorization = `bearer ${access_token}`;
      }
    }

    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const prepareDataObject = (_data_, paramObj) => {
  for (let key in _data_) {
    if (paramObj[key] || paramObj[key] === false) {
      _data_[key] = paramObj[key];
    } else {
      if (typeof _data_[key] !== 'object') _data_[key] = '';
    }
  }
  return _data_;
};

const injectParamsToUrl = (_url_, paramObj) => {
  var url = _url_;
  for (let key in paramObj) {
    url = url.replace(':' + key, paramObj[key]);
  }
  return url;
};

const handleErrorBySatusCode = error => {
  switch (error.status) {
    case 400:
    case 401:
    case 403:
    case 404:
    case 405:
    case 409:
    case 422:
      //console.log('switch case error', error);
      if (error && error.data && error.data.error_description) {
        const message = error.data.error_description;
        handleApiError(message);
      }
      if (error && error.data && error.data.message) {
        const message = error.data.message;
        handleApiError(message);
      }
      if (error.responseMessage) {
        const message = error.responseMessage;
        handleApiError(message);
      }
      break;
    default:
      console.log('switch case error', error);
      break;
  }
};

const innovecsysApiService = (apiKeyName, data) => {
  let apiDetails = ApiJson[apiKeyName];

  if (!apiDetails) {
    console.log(
      'Api configuration do not found in api-json, please check api-json.js'
    );
    throw new Error(
      'Api configuration do not found in api-json, please check api-json.js'
    );
    return;
  }

  let requestObject = Object.assign({}, apiDetails); //apiDetails; using deep clone
  requestObject.data = prepareDataObject(requestObject.data, data);
  if (requestObject.nodeUrl) {
    requestObject.url = injectParamsToUrl(
      NodeAPIURL + requestObject.nodeUrl,
      data
    );
  } else {
    requestObject.url = injectParamsToUrl(requestObject.url, data);
  }

  return axios(requestObject)
    .then(function(result) {
      //console.log('result', result);

      apiFailCounter = 0;
      if (result.data && result.data.status && result.data.status === 200) {
        if (result.data.responseMessage) {
          const message = result.data.responseMessage;
          if (requestObject.showResultMessage === true)
            showSuccessToast(message);
        }
      } else {
        // In 200 response status we get status in data object to detect error or success
        handleErrorBySatusCode(result.data);
      }

      //Custom message will display in case of login
      if (result.data && result.data.customMessage) {
        const message = result.data.customMessage;
        if (requestObject.showResultMessage === true) showSuccessToast(message);
      }
      return result;
    })
    .catch(function(error) {
      console.log('error', error);
      if (error && error.response) {
        if (requestObject.showErrorMessage === true)
          handleErrorBySatusCode(error.response);
      }

      if (
        error.config.maxContentLength - 1 &&
        error.toString().indexOf('Network Error') > -1
      ) {
        apiFailCounter++;
        if (apiFailCounter >= 3) {
          removeCookie('userInfo');
          window.open(window.location.origin, '_self');
        }
      }

      return error.response;
    });
};

export default innovecsysApiService;
