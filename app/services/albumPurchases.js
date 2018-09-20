'use strict';

const axios = require('axios'),
  AlbumPurchase = require('../models').albumPurchase,
  logger = require('../logger'),
  errors = require('../errors');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: BASE_URL
});

const is404 = err => err.response && err.response.status === 404;

const fetchAll = () =>
  api
    .get('/albums')
    .then(({ data }) => data)
    .catch(err => {
      logger.error('ROUTE /albums', err.message);
      throw errors.externalAPIError();
    });

const fetchById = albumId =>
  api
    .get(`/albums/${albumId}`)
    .then(({ data }) => data)
    .catch(err => {
      logger.error('ROUTE /albums', err.message);
      throw is404(err) ? errors.notFound(`Resource album ${albumId} not found`) : errors.externalAPIError();
    });

const fetchPhotosById = albumId =>
  api
    .get(`/albums/${albumId}/photos`)
    .then(({ data }) => data)
    .catch(err => {
      logger.error('ROUTE /albums/:id/photos', err.message);
      throw is404(err)
        ? errors.notFound(`Resource photos for album ${albumId} not found`)
        : errors.externalAPIError();
    });

const create = values =>
  AlbumPurchase.create(values).catch(err => {
    throw errors.databaseError(err.message);
  });

const fetchAndCreate = ({ buyerId, albumId }) =>
  fetchById(albumId).then(({ title }) => create({ albumId, buyerId, title }));

module.exports = {
  fetchPhotosById,
  fetchAndCreate,
  fetchAll,
  fetchById,
  create,
  BASE_URL
};
