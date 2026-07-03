const shoppingCartsDao = require("../dao/shoppingCarts-dao");
const cacheModule = require("../dao/cache-module");



async function updateShoppingCart(isCheckedOut, cartId) {
     await shoppingCartsDao.updateShoppingCart(isCheckedOut, cartId);
}


async function addShoppingCart(userId, token) {

     await shoppingCartsDao.addShoppingCart(userId)

     let cartDetails = await shoppingCartsDao.getShoppingCart(userId)
     console.log(cartDetails)


     let userData = cacheModule.get(token)
     console.log(userData)

     userData.shoppingCartId = cartDetails.cart_id
     console.log(userData.shoppingCartId)
     cacheModule.set(token, userData)

     console.log(cacheModule.get(token))
     let lastCartDetails = { isCheckedOut: cartDetails.is_checked_out, cartDate: cartDetails.cartDate, totalPrice: cartDetails.total_price, orderDate: cartDetails.orderDate }
     console.log(lastCartDetails)
     return lastCartDetails

}

async function getShoppingCart(userId) {
     let cartDetails = await shoppingCartsDao.getShoppingCart(userId);
     return cartDetails;
}

// addShoppingCart(312542354, 1);

// updateShoppingCart(0,125)


module.exports = {
     addShoppingCart,
     updateShoppingCart,
     getShoppingCart
};