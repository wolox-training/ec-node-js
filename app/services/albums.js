'use strict';

const axios = require('axios');

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

exports.getAll = () => {
  return api.get('/albums').then(({ data }) => data);
};
