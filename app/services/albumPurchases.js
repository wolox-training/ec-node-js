'use strict';

const axios = require('axios'),
  AlbumPurchase = require('../models').albumPurchase,
  logger = require('../logger'),
  errors = require('../errors');

exports.BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: exports.BASE_URL
});

const is404 = err => err.response && err.response.status === 404;

exports.fetchAll = () =>
  api
    .get('/albums')
    .then(({ data }) => data)
    .catch(err => {
      logger.error('ROUTE /albums', err.message);
      throw errors.externalAPIError();
    });

exports.fetchById = albumId =>
  api
    .get(`/albums/${albumId}`)
    .then(({ data }) => data)
    .catch(err => {
      logger.error('ROUTE /albums', err.message);
      throw is404(err) ? errors.notFound(`Resource album ${albumId} not found`) : errors.externalAPIError();
    });

exports.fetchPhotosById = albumId =>
  api
    .get(`/albums/${albumId}/photos`)
    .then(({ data }) => data)
    .catch(err => {
      logger.error('ROUTE /albums/:id/photos', err.message);
      throw is404(err)
        ? errors.notFound(`Resource photos for album ${albumId} not found`)
        : errors.externalAPIError();
    });

exports.create = values =>
  AlbumPurchase.create(values).catch(err => {
    throw errors.databaseError(err.message);
  });

exports.fetchAndCreate = ({ buyerId, albumId }) =>
  exports.fetchById(albumId).then(({ title }) => exports.create({ albumId, buyerId, title }));
