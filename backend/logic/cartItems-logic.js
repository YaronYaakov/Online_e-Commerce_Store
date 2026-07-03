const cartItemsDao = require("../dao/cartItems-dao");
const ErrorType = require("../errors/error-type");
const shoppingCartsLogic = require("../logic/shoppingCarts-logic");
const ServerError = require("../errors/server-error");


async function addCartItem(cart_item, cart_id) {
  if (await cartItemsDao.isCartItemExistInCart(cart_item, cart_id)) {
    await cartItemsDao.updateCartItem(cart_item, cart_id);
  }
  else {
    await cartItemsDao.addCartItem(cart_item, cart_id);
  }
  await shoppingCartsLogic.updateShoppingCart(0, cart_id)
}


async function deleteCartItem(cart_id, product_id) {
  await cartItemsDao.deleteCartItem(cart_id, product_id);
  await shoppingCartsLogic.updateShoppingCart(0, cart_id)

}


async function deleteAllCartItems(cart_id) {
  await cartItemsDao.deleteAllCartItems(cart_id);
  await shoppingCartsLogic.updateShoppingCart(0, cart_id)

}


async function getMyCartItems(cart_id) {
  let allMyProducts = await cartItemsDao.getMyCartItems(cart_id);
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
