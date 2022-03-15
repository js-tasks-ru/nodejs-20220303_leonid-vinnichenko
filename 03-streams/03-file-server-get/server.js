const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Nested folders forbidden');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      fs.createReadStream(filepath)
        .on('error', (e) => {
          if (e.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File is not found');
          } else {
            res.statusCode = 500;
            res.end('Internal server error');
          }
        })
        .pipe(res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
