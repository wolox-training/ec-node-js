const nock = require('nock'),
  faker = require('faker'),
  baseURL = require('../../app/services/albumPurchases').BASE_URL;

exports.fakes = {
  albumsSamples: () => [
    {
      albumId: 1,
      title: faker.lorem.sentence(),
      userId: faker.random.number(1)
    },
    {
      albumId: 2,
      title: faker.lorem.sentence(),
      userId: faker.random.number(2)
    },
    {
      albumId: 3,
      title: faker.lorem.sentence(),
      userId: faker.random.number(1)
    }
  ],
  photosSamples: () => [
    {
      id: 1,
      title: faker.lorem.sentence(),
      albumId: faker.random.number({ min: 1, max: 100 }),
      url: faker.internet.url(),
      thumbnailUrl: faker.internet.url()
    },
    {
      id: 2,
      title: faker.lorem.sentence(),
      albumId: faker.random.number({ min: 1, max: 100 }),
      url: faker.internet.url(),
      thumbnailUrl: faker.internet.url()
    },
    {
      id: 3,
      title: faker.lorem.sentence(),
      albumId: faker.random.number({ min: 1, max: 100 }),
      url: faker.internet.url(),
      thumbnailUrl: faker.internet.url()
    }
  ]
};

exports.mockIndexToSuccess = () =>
  nock(baseURL)
    .get('/albums')
    .reply(200, exports.fakes.albumsSamples());

exports.mockShowToSuccess = id =>
  nock(baseURL)
    .get(`/albums/${id}`)
    .reply(200, exports.fakes.albumsSamples()[id]);

exports.mockPhotosToSuccess = id =>
  nock(baseURL)
    .get(`/albums/${id}/photos`)
    .reply(200, exports.fakes.photosSamples());

exports.mockIndexToFail = () =>
  nock(baseURL)
    .get('/albums')
    .reply(500, 'Something went wrong!');

exports.mockShowToFail = id =>
  nock(baseURL)
    .get(`/albums/${id}`)
    .reply(500, 'Something went wrong!');

exports.mockShowToNotFound = id =>
  nock(baseURL)
    .get(`/albums/${id}`)
    .reply(404, 'Not found');

exports.mockPhotosToFail = id =>
  nock(baseURL)
    .get(`/albums/${id}/photos`)
    .reply(500, 'Something went wrong!');
