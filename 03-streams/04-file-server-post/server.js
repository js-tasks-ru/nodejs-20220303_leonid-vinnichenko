const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Nested folders forbidden');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  let exists = false;

  try {
    exists = await checkFileExists(filepath);
  } catch (e) {
    res.statusCode = 500;
    res.end('Internal server error');
    return;
  }

  if (exists) {
    res.statusCode = 409;
    res.end('File already exists');
    return;
  }

  switch (req.method) {
    case 'POST':
      const limitedStream = new LimitSizeStream({ limit: 1048576 });
      const writeStream = fs.createWriteStream(filepath);

      limitedStream.once('error', async (e) => {
        if (e instanceof LimitExceededError) {
          res.statusCode = 413;
          res.end('File size exceeded');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }

        await deleteFileQuietly(filepath);
      });

      writeStream.once('error', async () => {
        res.statusCode = 500;
        res.end('Internal server error');

        await deleteFileQuietly(filepath);
      });

      const handleConnectionRefused = async () => {
        limitedStream.destroy();
        writeStream.destroy();

        await deleteFileQuietly(filepath);
      };

      req.once('abort', handleConnectionRefused);
      req.once('error', handleConnectionRefused);

      req
        .pipe(limitedStream)
        .pipe(writeStream)
        .once('finish', () => {
          res.statusCode = 201;
          res.end('Successfully uploaded');
        });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

async function deleteFileQuietly(filepath) {
  try {
    await fsPromises.unlink(filepath);
  } catch (e) {
    // do nothing
  }
}

async function checkFileExists(filepath) {
  try {
    await fsPromises.stat(filepath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
  return true;
}

module.exports = server;
