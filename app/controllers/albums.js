'use strict';

const albumService = require('../services/albumPurchases'),
  logger = require('../logger'),
  errors = require('../errors');

const userBoughtAlbum = (user, albumId) =>
  user.getAlbumPurchases({ where: { albumId } }).then(([found]) => found);

const fetchAll = (req, res, next) => {
  albumService
    .fetchAll()
    .then(data => {
      logger.info('Data fetched from external api succesfully!');
      res.status(200).send(data);
    })
    .catch(next);
};

const purchaseAlbum = (req, res, next) => {
  const { albumId } = req.params,
    user = req.user;
  userBoughtAlbum(user, albumId)
    .then(found => {
      if (!found) {
        albumService
          .fetchAndCreate({ albumId, buyerId: user.id })
          .then(albumPurchase => res.status(201).send(albumPurchase))
          .catch(next);
      } else {
        res.status(200).send({ message: `User '${user.email}' already purchases album #${albumId}` });
      }
    })
    .catch(next);
};

const listPurchasedAlbumPhotos = (req, res, next) => {
  const { albumId } = req.params,
    user = req.user;
  userBoughtAlbum(user, albumId)
    .then(found => {
      if (found) {
        albumService
          .fetchPhotosById(albumId)
          .then(photos => {
            logger.info('Data fetched from external api succesfully!');
            res.status(200).send(photos);
          })
          .catch(next);
      } else {
        next(errors.notPermissionsError(`User '${user.email}' has not permissions`));
      }
    })
    .catch(next);
};

module.exports = {
  fetchAll,
  purchaseAlbum,
  listPurchasedAlbumPhotos
};
