const ordersDao = require("../dao/orders-dao");
const shoppingCartsLogic = require("../logic/shoppingCarts-logic");
const cartItemsLogic = require("../logic/cartItems-logic");

const ErrorType = require("./../errors/error-type");
const ServerError = require("./../errors/server-error")



async function addOrder(order, cart_id, user_id) {

    // Validations
    let userDetail = {};
    if (await ordersDao.isOrderExist(user_id, cart_id)) {
        console.log("ORDER_ALREADY_EXISTS");
        throw new ServerError(ErrorType.ORDER_ALREADY_EXISTS);
    }
    await ordersDao.addOrder(order, cart_id, user_id)
    await shoppingCartsLogic.updateShoppingCart(1, cart_id)
    let cartDetails = await shoppingCartsLogic.getShoppingCart(user_id)
    let cart_items = await cartItemsLogic.getMyCartItems(cart_id)
    userDetail.order_date = cartDetails.order_date;
    userDetail.is_checked_out = cartDetails.is_checked_out;
    userDetail.total_price = cartDetails.total_price;
    userDetail.cart_items = cart_items;

    return userDetail;
}



async function getCaughtShipDates() {

    let caughtShipDates = await ordersDao.getCaughtShipDates();
    return caughtShipDates
}


async function getOrdersAmount() {

    let ordersAmount = await ordersDao.getOrdersAmount();
    return ordersAmount
}

// let order = { shipCity:2, shipStreet: 'ssd', shipDate: '2020/05/04', creditNumber: '1455234' };
// addOrder(order,8,111111111);


// getOrdersAmount()

// getCaughtShipDates()


module.exports = {
    addOrder,
    getCaughtShipDates,
    getOrdersAmount
};