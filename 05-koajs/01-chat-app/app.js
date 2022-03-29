const path = require('path');
const Koa = require('koa');
const Chat = require('./Chat');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const Validator = require('../../04-testing-configuration-logging/01-unit-tests/Validator');
const router = new Router();

const chat = new Chat();

router.get('/subscribe', async (ctx) => {
  ctx.body = await chat.getNextMessage();
});

router.post('/publish', async (ctx) => {
  if (
    ctx.request.body === null ||
    ctx.request.body === undefined ||
    typeof ctx.request.body !== 'object'
  ) {
    ctx.body = { error: 'payload must be an object' };
    ctx.status = 400;
    return;
  }

  const validator = new Validator({
    message: {
      type: 'string',
      min: 0,
      max: 1000,
    },
  });

  const errors = validator.validate(ctx.request.body);

  if (errors.length !== 0) {
    ctx.body = errors;
    ctx.status = 400;
    return;
  }

  chat.publishMessage(ctx.request.body.message);
  ctx.body = 'done';
});

app.use(router.routes());

module.exports = app;
