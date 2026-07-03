const statisticsLogic = require("../logic/statistics-logic");
const express = require("express");
const router = express.Router();


// GET AMOUNT OF PRODUCTS AND ORDERS
// GET http://localhost:3000/statistics
router.get("/", async (request, response, next) => {
    try {
        let statistics = await statisticsLogic.getStatistics();
        console.log(statistics.ordersCount +","+statistics.productsCount)
        response.json(statistics);

    } catch (error) {
        return next(error);
    }
});




module.exports = router;