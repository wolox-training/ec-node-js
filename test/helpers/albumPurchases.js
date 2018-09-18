const nock = require('nock'),
  baseURL = 'https://jsonplaceholder.typicode.com/';

const mockIndexToSuccess = () =>
  nock(baseURL)
    .get('/albums')
    .reply(200, [
      { userId: 1, id: 1, title: 'quidem molestiae enim' },
      { userId: 1, id: 2, title: 'sunt qui excepturi placeat culpa' },
      { userId: 1, id: 3, title: 'omnis laborum odio' }
    ]);

const mockIndexToFail = () =>
  nock(baseURL)
    .get('/albums')
    .reply(500, 'Something went wrong!');

module.exports = {
  mockIndexToFail,
  mockIndexToSuccess
};
