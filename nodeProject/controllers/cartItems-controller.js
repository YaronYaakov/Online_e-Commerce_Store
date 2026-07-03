const cartItemsLogic = require("../logic/cartItems-logic");
const express = require("express");
const usersCache = require("../dao/cache-module");


const router = express.Router();



// DELETE ALL CART ITEMS
// DELETE http://localhost:3000/cartItems/allItems
router.delete("/allItems", async (request, response, next) => {

    try {
        // In order to succeed, we must extract the user's userData from the cache
        let authorizationString = request.headers["authorization"];
        // Removing the bearer prefix, leaving the clean token
        let token = authorizationString.substring("Bearer ".length);
        let userData = usersCache.get(token);

        console.log(userData);
        await cartItemsLogic.deleteAllCartItems(userData.shoppingCartId)
        response.json();
    }
    catch (error) {
        // console.log(error);
        return next(error);
    }
});


// DELETE A CART ITEM
// DELETE http://localhost:3000/cartItems?productId=?
router.delete("/", async (request, response, next) => {

    let productId = request.query.productId;

    try {
        // In order to succeed, we must extract the user's userData from the cache
        let authorizationString = request.headers["authorization"];
        // Removing the bearer prefix, leaving the clean token
        let token = authorizationString.substring("Bearer ".length);
        let userData = usersCache.get(token);

        await cartItemsLogic.deleteCartItem(userData.shoppingCartId, productId)
        response.json();
    }
    catch (error) {
        // console.log(error);
        return next(error);
    }
});



// ADD A NEW ITEM IN CART
// POST http://localhost:3000/cartItems
router.post("/", async (request, response, next) => {

    let product = request.body;

    try {
        // In order to succeed, we must extract the user's userData from the cache
        let authorizationString = request.headers["authorization"];
        // Removing the bearer prefix, leaving the clean token
        let token = authorizationString.substring("Bearer ".length);
        let userData = usersCache.get(token);

        console.log("token : " + token);
        console.log(userData);


        await cartItemsLogic.addCartItem(product, userData.shoppingCartId);
        response.json();
    }
    catch (error) {
        // console.log(error);
        return next(error);
    }
});


// GET ALL MY ITEMS IN CART
// GET http://localhost:3000/cartItems/me
router.get("/me", async (request, response, next) => {

    try {
        // In order to succeed, we must extract the user's userData from the cache
        let authorizationString = request.headers["authorization"];
        // Removing the bearer prefix, leaving the clean token
        let token = authorizationString.substring("Bearer ".length);
        let userData = usersCache.get(token);

        console.log("token : " + token);
        console.log(userData);

        let allMyProducts = await cartItemsLogic.getMyCartItems(userData.shoppingCartId);
        console.log(allMyProducts)
        response.json(allMyProducts);
    }
    catch (error) {
        // console.log(error);
        return next(error);
    }
});



module.exports = router;