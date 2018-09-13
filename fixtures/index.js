const fs = require('fs'),
  path = require('path');

// including all fixture files
const normalizedPath = path.join(__dirname, '.');

const isDirectory = pathToSearch => fs.lstatSync(pathToSearch).isDirectory();

const sliceExtension = name => name.slice(0, -3);

const exportAllFixtures = pathToSearch => {
  fs
    .readdirSync(pathToSearch)
    .filter(file => !isDirectory(`${pathToSearch}/${file}`))
    .forEach(file => {
      exports[sliceExtension(file)] = require(`${pathToSearch}/${file}`);
    });
};

exportAllFixtures(normalizedPath);
