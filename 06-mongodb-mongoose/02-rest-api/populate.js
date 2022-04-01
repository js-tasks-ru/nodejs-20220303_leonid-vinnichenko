const connection = require('./libs/connection');
const Category = require('./models/Category');
const Product = require('./models/Product');

async function main() {
  await Category.deleteMany();
  await Product.deleteMany();

  const book = await Category.create({
    title: 'Books',
    subcategories: [
      { title: 'Fiction' },
      { title: 'Thriller' },
      { title: 'Comedy' },
    ],
  });

  const product = await Product.create({
    title: 'Anna Karenina',
    images: ['image1', 'image2'],
    category: book,
    subcategory: book.subcategories[1],
    price: 10,
    description: 'Description1',
  });

  console.log(product);

  await connection.close();
}

main();
