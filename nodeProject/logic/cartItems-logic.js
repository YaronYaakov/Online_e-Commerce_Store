const cartItemsDao = require("../dao/cartItems-dao");
const ErrorType = require("../errors/error-type");
const shoppingCartsLogic = require("../logic/shoppingCarts-logic");
const ServerError = require("../errors/server-error");


async function addCartItem(cartItem, cartId) {
  if (await cartItemsDao.isCartItemExistInCart(cartItem, cartId)) {
    await cartItemsDao.updateCartItem(cartItem, cartId);
  }
  else {
    await cartItemsDao.addCartItem(cartItem, cartId);
  }
  await shoppingCartsLogic.updateShoppingCart(0, cartId)
}


async function deleteCartItem(cartId, productId) {
  await cartItemsDao.deleteCartItem(cartId, productId);
  await shoppingCartsLogic.updateShoppingCart(0, cartId)

}


async function deleteAllCartItems(cartId) {
  await cartItemsDao.deleteAllCartItems(cartId);
  await shoppingCartsLogic.updateShoppingCart(0, cartId)

}


async function getMyCartItems(cartId) {
  let allMyProducts = await cartItemsDao.getMyCartItems(cartId);
  return allMyProducts;
}

// let cartItem = { productId: 5, quantity: 1 };
// addCartItem(cartItem, 1);

// deleteCartItem(1, 5)

// deleteAllCartItems(1)

// getMyCartItems(1)

module.exports = {
  addCartItem,
  deleteCartItem,
  deleteAllCartItems,
  getMyCartItems,
};
