'use strict';

const axios = require('axios');

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

exports.getAll = () => {
  return api.get('/albums').then(({ data }) => data);
};

exports.find = id => {
  return api.get(`/albums/${id}`).then(({ data }) => data);
};

exports.create = body => {
  return api.post('/albums', body).then(({ data }) => data);
};

exports.update = (id, body) => {
  return api.put(`/albums/${id}`, body).then(({ data }) => data);
};

exports.delete = id => {
  return api
    .delete(`/albums/${id}`)
    .then(() => 'deleted')
    .catch(err => `${err}`);
};
