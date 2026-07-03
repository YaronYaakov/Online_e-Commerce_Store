const citiesLogic = require("../logic/cities-logic");
const express = require("express");

const router = express.Router();

//GET ALL CITES
// GET http://localhost:3000/cities
router.get("/", async (request, response, next) => {
    try {
        let cities = await citiesLogic.getAllCities();
        response.json(cities);
    }
    catch (error) {
        return next(error);
    }
});



module.exports = router;
