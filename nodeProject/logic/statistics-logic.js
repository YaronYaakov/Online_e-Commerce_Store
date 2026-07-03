const productsLogic = require("../logic/products-logic");
const ordersLogic = require("../logic/orders-logic");




async function getStatistics() {

    let statistics = {};
    statistics.ordersAmount = await ordersLogic.getOrdersAmount();
    statistics.productsAmount = await productsLogic.getAmountOfProducts();
    return statistics;
}

// getStatistics();


module.exports = {
    getStatistics
};