'use strict';

const faker = require('faker'),
  AlbumPurchase = require('../../app/models').albumPurchase;

const data = (props = {}) =>
  Object.assign(
    {
      id: 1,
      title: faker.lorem.sentence(),
      albumId: faker.random.number(),
      url: faker.internet.url(),
      thumbnailUrl: faker.image.imageUrl()
    },
    props
  );

exports.create = props => AlbumPurchase.create(data(props));
