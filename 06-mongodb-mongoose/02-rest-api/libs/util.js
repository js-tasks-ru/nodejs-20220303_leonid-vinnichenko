const mongoose = require('mongoose');

function validateObjectId(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = 'invalid object id';
    return;
  }

  return next();
}

function mongoSerialize(obj) {
  if (obj instanceof mongoose.Document) {
    return mongoSerialize(obj.toObject());
  }

  if (obj instanceof mongoose.Types.ObjectId) {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map((v) => mongoSerialize(v));
  }

  if (obj !== undefined && obj !== null && typeof obj === 'object') {
    const result = {};

    for (let key of Object.keys(obj)) {
      if (key === '__v') {
        continue;
      }

      let value = obj[key];

      if (key === '_id') {
        key = 'id';
      }

      result[key] = mongoSerialize(value);
    }

    return result;
  }

  return obj;
}

module.exports = { validateObjectId, mongoSerialize };
