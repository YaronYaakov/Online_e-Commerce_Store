const categoriesLogic = require("../logic/categories-logic");
const express = require("express");

const router = express.Router();

//GET ALL CATEGORIES
// GET http://localhost:3000/categories
router.get("/", async (request, response, next) => {
  try {
    let categories = await categoriesLogic.getAllCategories();

    response.json(categories);
  } catch (error) {
    // console.log(error);
    return next(error);
  }
});



module.exports = router;
