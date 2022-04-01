const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;

  if (!query) return next();

  const products = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  ctx.body = { products: products.map((p) => mapProduct(p)) };
};
