const productsDao = require("../dao/products-dao");
const ErrorType = require("./../errors/error-type");
const ServerError = require("./../errors/server-error");
const uuid = require("uuid");

// Only by admin
async function addProduct(product, type) {

  if (type == "ADMIN") {
    if (await productsDao.isProductExistByName(product.name)) {
      console.log("PRODUCT_ALREADY_EXISTS");
      throw new ServerError(ErrorType.PRODUCT_ALREADY_EXISTS);
    }
    await productsDao.addProduct(product);
    let allProducts = await productsDao.getAllProducts()
    return allProducts;

  }
  else {
    throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
  }
}

// Only by admin
async function updateProduct(product, type) {
  if (type == "ADMIN") {
    if (product.isNewName && (await productsDao.isProductExistByName(product.name))) {
      throw new ServerError(ErrorType.PRODUCT_ALREADY_EXISTS);
    }
    await productsDao.updateProduct(product);
  }
  else {
    throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
  }
}



async function uploadProductImage(file, type) {
  console.log("my type: " + type)
  if (type != "ADMIN") {
    throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
  }
  const extension = file.name.substr(file.name.lastIndexOf("."));
  const newUuidFileName = uuid.v4();
  file.mv("./uploads/" + newUuidFileName + extension);

  let successfulUploadResponse = newUuidFileName + extension + "";

  return successfulUploadResponse;
}


async function getAllProducts() {
  let allProducts = await productsDao.getAllProducts();
  return allProducts;
}

async function getAmountOfProducts() {

  let productsAmount = await productsDao.getAmountOfProducts()
  return productsAmount
}


// async function addProduct(product, file) {

//   if (type == "ADMIN") {
//     let extension = file.name.substr(file.name.lastIndexOf("."));
//     let newImageName = uuid.v4();
//     newImageName = newImageName + extension;

//     file.mv("./uploads/" + newImageName);
//     product.picture = newImageName;
//     await productsDao.addProduct(product);
//   } else {
//     throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);

//   }
// }


// async function updateProduct(product, files) {
//   if (type == "ADMIN") {
//     let extension = file.name.substr(file.name.lastIndexOf("."));
//     let newImageName = uuid.v4();
//     newImageName = newImageName + extension;

//     file.mv("./uploads/" + newImageName);
//     product.picture = newImageName;
//     await productsDao.updateProduct(product);
//   } else {
//     throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
//   }
// }

// let product = {name:'banana', price: 3.5, categoryName:'fish', picture: 'https://target.scene7.com/is/image/Target/GUEST_f5d0cfc3-9d02-4ee0-a6c6-ed5dc09971d1?wid=488&hei=488&fmt=pjpeg', quantity:2};
// addProduct(product,"ADMIN");

// let product = { name: 'banana', price: 4.50, categoryName: "fish", picture: 'https://www.collinsdictionary.com/images/thumb/54.jpg', quantity: 23};
// updateProduct(product);

// getAmountOfProducts()

// getAllProducts()



module.exports = {
  addProduct,
  updateProduct,
  getAllProducts,
  uploadProductImage,
  getAmountOfProducts
};
