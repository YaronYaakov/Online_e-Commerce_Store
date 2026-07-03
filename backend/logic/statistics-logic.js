const productsLogic = require("../logic/products-logic");
const ordersLogic = require("../logic/orders-logic");

async function getStatistics() {

    let statistics = {};
    statistics.ordersCount = await ordersLogic.getOrdersAmount();
    statistics.productsCount = await productsLogic.getAmountOfProducts();
    return statistics;
}

// getStatistics();


module.exports = {
    getStatistics
};