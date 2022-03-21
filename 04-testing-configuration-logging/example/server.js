const http = require('http');
const fs = require('fs');
const path = require('path');
const Validator = require('../01-unit-tests/Validator');

const server = new http.Server();

server.on('request', async (req, res) => {
  switch (req.url) {
    case '/':
      res.end('hello world');
      break;
    case '/calculate':
      const body = [];

      for await (const chunk of req) {
        body.push(chunk);
      }

      try {
        const result = JSON.parse(Buffer.concat(body).toString('utf-8'));
        const validator = new Validator({
          a: {
            type: 'number',
            min: Number.NEGATIVE_INFINITY,
            max: Number.POSITIVE_INFINITY,
          },
          b: {
            type: 'number',
            min: Number.NEGATIVE_INFINITY,
            max: Number.POSITIVE_INFINITY,
          },
        });

        const errors = validator.validate(result);

        if (errors.length > 0) {
          res.statusCode = 400;
          res.end(JSON.stringify(errors));
          return;
        }

        const { a, b } = result;

        const c = a + b;

        const stream = fs.createWriteStream(path.join(__dirname, 'result.txt'));

        stream.once('error', () => {
          res.statusCode = 500;
          res.end('internal server error');
        });

        stream.once('finish', () => {
          res.end('calculated');
        });

        stream.end(c.toString());
      } catch (e) {
        res.statusCode = 500;
        res.end('internal server error');
      }
      break;
    default:
      res.statusCode = 404;
      res.end('not found');
  }
});

module.exports = server;
