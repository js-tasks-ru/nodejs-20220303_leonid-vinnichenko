const mongose = require('mongoose');
const { mongoSerialize } = require('../libs/util');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  if (!mongose.Types.ObjectId.isValid(subcategory)) {
    ctx.body = 'subcategory is invalid object id';
    ctx.status = 400;
    return;
  }

  const products = await Product.find({ subcategory });

  ctx.body = mongoSerialize({ products });
};

module.exports.productList = async function productList(ctx) {
  const products = await Product.find({});

  ctx.body = mongoSerialize({ products });
};

module.exports.productById = async function productById(ctx) {
  const product = await Product.findById(ctx.params.id);

  if (product === null) {
    ctx.status = 404;
    ctx.body = 'product is not found';
    return;
  }

  ctx.body = mongoSerialize({ product });
};
