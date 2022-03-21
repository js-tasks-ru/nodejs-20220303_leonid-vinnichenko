const http = require('http');

const server = new http.Server();

server.on('request', (_req, res) => {
  res.end('hello world');
});

module.exports = server;
