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
    await productsLogic.updateProduct(product, userData.user_type);
    response.json();

  } catch (error) {
    return next(error);
  }
});

// GET ALL PRODUCTS
// GET http://localhost:3000/products
router.get("/", async (request, response, next) => {
  try {
    let allProducts = await productsLogic.getAllProducts();
    response.json(allProducts);
    
  } catch (error) {
    return next(error);
  }
});

// CREATE A NEW PRODUCT
// POST http://localhost:3000/products
router.post("/", async (request, response, next) => {
  // Extracting the JSON from the packet's BODY
  let product = request.body;
console.log(product)
  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);
    console.log(product);

    let allProducts = await productsLogic.addProduct(product, userData.user_type
    );
    response.json(allProducts);

  } catch (error) {
    return next(error);
  }
});

// UPLOAD AN IMAGE
// POST http://localhost:3000/products/uploadImageFile
router.post("/uploadImageFile", async (request, response, next) => {
  // Extracting from the request the image file that's supposed to be uploaded
  const file = request.files.file;
console.log(file);  
  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);

    let successfulUploadResponse = await productsLogic.uploadProductImage(file, userData.user_type);

    response.json(successfulUploadResponse);
  } catch (error) {
    return next(error);
  }
});


module.exports = router;
