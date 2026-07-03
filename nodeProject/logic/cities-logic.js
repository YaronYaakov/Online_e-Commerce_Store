const categoriesDao = require("../dao/cities-dao");



async function getAllCities() {
    let allCities = await categoriesDao.getAllCities();
    console.log(allCities)
    return allCities;
}


// getAllCities()

module.exports = {
    getAllCities
};
