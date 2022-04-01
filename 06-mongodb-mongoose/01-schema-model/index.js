const connection = require('./libs/connection');
const Category = require('./models/Category');

async function main() {
  await Category.create({
    title: 'C1',
    subcategories: [{ title: 'C2' }],
  });

  await connection.close();
}

main();
