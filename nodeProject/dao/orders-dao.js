const connection = require("./connection-wrapper");
const ErrorType = require("./../errors/error-type");
const ServerError = require("./../errors/server-error")


async function addOrder(order, shoppingCartId, userId) {
    let sql = "INSERT INTO  orders SET user_id = ?, cart_id = ? , total_price  = (select total_price from shopping_carts where cart_id = ? ), ship_city=? ,ship_street = ? ,ship_date = ?, final_digits =  SUBSTRING(?, -4, 4) AS final_digits";
    let parameters = [userId, shoppingCartId, shoppingCartId, order.shipCity, order.shipStreet, order.shipDate, order.creditNumber];
    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);

    }
}

async function getOrdersAmount() {
    let sql = "SELECT count(order_id) as ordersAmount FROM  orders";

    try {
        let ordersAmount = await connection.execute(sql);
        return ordersAmount[0].ordersAmount;

    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function getCaughtShipDates() {
    let sql = "SELECT COUNT(order_id) AS 'number_of_orders', DATE_FORMAT(ship_date, '%Y-%m-%d') AS 'ship_date' from orders where ship_date > current_timestamp() GROUP BY ship_date HAVING number_of_orders >= 3";
    try {
        let caughtShipDates = await connection.execute(sql);
        return caughtShipDates
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function isOrderExist(userId, cartId) {
    let sql = "select order_id from orders  where user_id = ? and cart_id =?";
    let parameters = [userId, cartId];
    let OrderData;

    try {
        OrderData = await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }

    if (OrderData == null || OrderData.length == 0) {
        return false;
    }

    return true;
}

// let order = { shipCity:2, shipStreet: 'ssd', shipDate: '2020/05/04', creditNumber: '1455234' };
// addOrder(order,8,111111111);

// getOrdersAmount()

// getCaughtShipDates()

module.exports = {
    addOrder,
    getOrdersAmount,
    getCaughtShipDates,
    isOrderExist
};