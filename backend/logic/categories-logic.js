const categoriesDao = require("../dao/categories-dao");



async function getAllCategories() {
  let allCategories = await categoriesDao.getAllCategories();
  return allCategories;
}


// getAllCategories()

module.exports = {
  getAllCategories
};
