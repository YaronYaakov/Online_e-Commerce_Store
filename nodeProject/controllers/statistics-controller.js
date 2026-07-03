const statisticsLogic = require("../logic/statistics-logic");
const express = require("express");
const router = express.Router();


// GET AMOUNT OF PRODUCTS AND ORDERS
// GET http://localhost:3000/statistics
router.get("/", async (request, response, next) => {
    try {
        let allStatistics = await statisticsLogic.getStatistics();
        response.json(allStatistics);

    } catch (error) {
        // console.log(error);
        return next(error);
    }
});




module.exports = router;