const fs = require('fs');

exports.file = {
  readFileSync: (path) => {
    return fs.readFileSync(path, 'utf8');
  },
};
