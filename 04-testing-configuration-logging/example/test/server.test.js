const got = require('got');
const expect = require('chai').expect;
const server = require('../server');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

describe('server test', () => {
  before((done) => {
    server.listen(PORT, done);
  });

  it('get /', async () => {
    const { body } = await got(`http://localhost:${PORT}`);

    expect(body).to.equal('hello world');
  });

  it('post /calucate', async () => {
    const { statusCode, body } = await got.post(
      `http://localhost:${PORT}/calculate`,
      {
        json: {
          a: 5,
          b: 3,
        },
      }
    );

    expect(statusCode).to.equal(200);
    expect(body).to.equal('calculated');

    const filepath = path.join(__dirname, '..', 'result.txt');

    const result = fs.readFileSync(filepath, { encoding: 'utf-8' });

    expect(+result).to.equal(5 + 3);
  });

  after((done) => {
    server.close(done);

    try {
      fs.unlinkSync(path.join(__dirname, '..', 'result.txt'));
    } catch (e) {
      //
    }
  });
});
