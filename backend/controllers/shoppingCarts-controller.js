const shoppingCartsLogic = require("../logic/shoppingCarts-logic");
const express = require("express");
const usersCache = require("../dao/cache-module");

const router = express.Router();



//CREATE A SHOPPING CART
// POST http://localhost:3000/shoppingCarts
router.post("/", async (request, response, next) => {

    try {
        let authorizationString = request.headers["authorization"];
        // Removing the bearer prefix, leaving the clean token
        let token = authorizationString.substring("Bearer ".length);
        let userData = usersCache.get(token);

        console.log("token : " + token);
        console.log(userData);

        let lastCartDetails = await shoppingCartsLogic.addShoppingCart(userData.user_id, token);
        response.json(lastCartDetails);

    } catch (error) {
        return next(error);
    }
});

module.exports = router;