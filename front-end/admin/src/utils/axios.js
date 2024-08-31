import axios from 'axios';
import { HOST_API } from '../config';

export const client = axios.create({
  baseURL: HOST_API,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

export const clientGet = (url, params) => {
  return client.get(url, { params })
}

export const clientPost = (url, data) => {
  return client.post(url, data);
};

export const clientPut = (url, data) => {
  return client.put(url, data);
};

export const clientDelele = (url, params) => {
  return client.delete(url, { params });
};

export const clientFormData = (url, data) => {
  return client.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Credentials': true
    },
  });
};

export const clientFormDataPut = (url, data) => {
  return client.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Credentials': true
    },
  });
};



