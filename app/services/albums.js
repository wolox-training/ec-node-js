'use strict';

const axios = require('axios');

const BASE_URL = 'https://jsonplaceholder.typicode.com';
const api = axios.create({
  baseURL: BASE_URL
});

exports.fetchAll = () => api.get('/albums').then(({ data }) => data);
