const ordersDao = require("../dao/orders-dao");
const shoppingCartsLogic = require("../logic/shoppingCarts-logic");
const cartItemsLogic = require("../logic/cartItems-logic");

const ErrorType = require("./../errors/error-type");
const ServerError = require("./../errors/server-error")



async function addOrder(order, shoppingCartId, userId) {

    // Validations
    let userDetail = {};
    if (await ordersDao.isOrderExist(userId, shoppingCartId)) {
        console.log("ORDER_ALREADY_EXISTS");
        throw new ServerError(ErrorType.ORDER_ALREADY_EXISTS);
    }
    await ordersDao.addOrder(order, shoppingCartId, userId)
    await shoppingCartsLogic.updateShoppingCart(1, shoppingCartId)
    let cartDetails = await shoppingCartsLogic.getShoppingCart(userId)
    let cartItems = await cartItemsLogic.getMyCartItems(shoppingCartId)
    userDetail.orderDate = cartDetails.orderDate;
    userDetail.isCheckedOut = cartDetails.is_checked_out;
    userDetail.totalPrice = cartDetails.total_price;
    userDetail.cartItems = cartItems;

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