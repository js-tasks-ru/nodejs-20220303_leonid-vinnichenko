const mongose = require('mongoose');
const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

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

  ctx.body = { products: products.map((p) => mapProduct(p)) };
};

module.exports.productList = async function productList(ctx) {
  const products = await Product.find({});

  ctx.body = { products: products.map((p) => mapProduct(p)) };
};

module.exports.productById = async function productById(ctx) {
  const product = await Product.findById(ctx.params.id);

  if (product === null) {
    ctx.status = 404;
    ctx.body = 'product is not found';
    return;
  }

  ctx.body = { product: mapProduct(product) };
};
