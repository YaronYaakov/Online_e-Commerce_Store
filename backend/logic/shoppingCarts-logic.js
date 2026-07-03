const shoppingCartsDao = require("../dao/shoppingCarts-dao");
const cacheModule = require("../dao/cache-module");



async function updateShoppingCart(is_checked_out, cart_id) {
     await shoppingCartsDao.updateShoppingCart(is_checked_out, cart_id);
}


async function addShoppingCart(user_id, token) {

     await shoppingCartsDao.addShoppingCart(user_id)

     let cartDetails = await shoppingCartsDao.getShoppingCart(user_id)
     console.log(cartDetails)


     let userData = cacheModule.get(token)
     console.log(userData)

     userData.cart_id = cartDetails.cart_id
     console.log(userData.cart_id)
     cacheModule.set(token, userData)

     console.log(cacheModule.get(token))
     let lastCartDetails = {is_checked_out : cartDetails.is_checked_out, cart_date: cartDetails.cart_date, total_price: cartDetails.total_price, order_date: cartDetails.order_date }
     console.log(lastCartDetails)
     return lastCartDetails

}

async function getShoppingCart(user_id) {
     let cartDetails = await shoppingCartsDao.getShoppingCart(user_id);
     return cartDetails;
}

// addShoppingCart(312542354, 1);

// updateShoppingCart(0,125)


module.exports = {
     addShoppingCart,
     updateShoppingCart,
     getShoppingCart
};