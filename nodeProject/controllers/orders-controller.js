const express = require("express");
const ordersLogic = require("../logic/orders-logic");
const usersCache = require("../dao/cache-module");

const router = express.Router();



// CREATE A NEW ORDER
// POST http://localhost:3000/orders
router.post("/", async (request, response, next) => {

    // Extracting the JSON from the packet's BODY
    let order = request.body;

    try {
        let authorizationString = request.headers["authorization"];
        // Removing the bearer prefix, leaving the clean token
        let token = authorizationString.substring("Bearer ".length);
        let userData = usersCache.get(token);

        let check = await ordersLogic.addOrder(order, userData.shoppingCartId, userData.userId)
        response.json(check);
    }
    catch (error) {
        // console.log(error);
        return next(error);
    }
});



//GET CAUGHT SHIP DATES
// GET http://localhost:3000/orders/caughtShipDates
router.get("/caughtShipDates", async (request, response, next) => {

    try {
        let caughtShipDates = await ordersLogic.getCaughtShipDates()
        response.json(caughtShipDates);
    }
    catch (error) {
        // console.log(error);
        return next(error);
    }
});

module.exports = router;