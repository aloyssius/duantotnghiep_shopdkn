import axios from 'axios';

export const goiApi = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export const goiApiGet = (url, params) => {
  return goiApi.get(url, { params })
}

export const goiApiPost = (url, data) => {
  return goiApi.post(url, data);
};

export const goiApiPut = (url, data) => {
  return goiApi.put(url, data);
};

export const goiApiDelete = (url, params) => {
  return goiApi.delete(url, { params });
};

export const goiApiPostFormData = (url, data) => {
  return goiApi.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Credentials': true
    },
  });
};

export const goiApiPutFormData = (url, data) => {
  return goiApi.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Credentials': true
    },
  });
};



