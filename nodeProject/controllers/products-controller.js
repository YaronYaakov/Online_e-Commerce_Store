const productsLogic = require("../logic/products-logic");
const express = require("express");
const usersCache = require("../dao/cache-module");

const router = express.Router();

// UPDATE A PRODUCT
// PUT http://localhost:3000/products
router.put("/", async (request, response, next) => {
  let product = request.body;
  console.log(product)
  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);
    await productsLogic.updateProduct(product, userData.userType);
    response.json();
  } catch (error) {
    // console.log(error);
    return next(error);
  }
});

// GET ALL PRODUCTS
// GET http://localhost:3000/products/all
router.get("/all", async (request, response, next) => {
  try {
    let allProducts = await productsLogic.getAllProducts();
    response.json(allProducts);
  } catch (error) {
    // console.log(error);
    return next(error);
  }
});

// CREATE A NEW PRODUCT
// POST http://localhost:3000/products
router.post("/", async (request, response, next) => {
  // Extracting the JSON from the packet's BODY
  let product = request.body;

  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);
    console.log(product);

    let allProducts = await productsLogic.addProduct(product, userData.userType);
    response.json(allProducts);

  } catch (error) {
    // console.log(error);
    return next(error);
  }
});

// UPLOAD AN IMAGE
// POST http://localhost:3000/products/uploadImageFile
router.post("/uploadImageFile", async (request, response, next) => {
  // Extracting from the request the image file that's supposed to be uploaded
  const file = request.files.file;

  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);

    let successfulUploadResponse = await productsLogic.uploadProductImage(file, userData.userType);

    response.json(successfulUploadResponse);
  } catch (error) {
    return next(error);
  }
});



// UPDATE A PRODUCT
// PUT http://localhost:3000/products
// router.put("/", async (request, response, next) => {
//   let product = request.body;
//   const files = request.files;

//   try {
//     await productsLogic.updateProductDetails(product, files);
//     response.json();
//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// });



// // CREATE A NEW PRODUCT 
// // POST http://localhost:3000/products
// router.post("/", async (request, response, next) => {
//   let product = request.body;
//   const file = request.files.file;

//   try {
//     await productsLogic.addProduct(product, file);
//     response.json();

//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// });


module.exports = router;
