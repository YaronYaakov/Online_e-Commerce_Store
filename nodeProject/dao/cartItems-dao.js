const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error")


async function addCartItem(cartItem, cartId) {

    let sql = "INSERT INTO cart_items SET cart_id =?, product_id = ?, quantity =?, total_price =  quantity * (SELECT price FROM products WHERE product_id = ?)";
    let parameters = [cartId, cartItem.productId, cartItem.quantity, cartItem.productId];
    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);

    }
}



async function getMyCartItems(cartId) {
    let sql = "select p.product_id as productId, p.name, c.quantity, p.picture, c.total_price, p.price from shopping_carts s join cart_items c  on s.cart_id = c.cart_id  join products p on c.product_id = p.product_id where s.cart_id = ?";
    let parameters = [cartId];

    try {
        let allMyProducts = await connection.executeWithParameters(sql, parameters);
        return allMyProducts;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}


async function deleteCartItem(cartId, productId) {
    let sql = "delete from cart_items where cart_id = ? and product_id = ? ";
    let parameters = [cartId, productId];
    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function deleteAllCartItems(cartId) {
    let sql = "delete from cart_items where cart_id=?";
    let parameters = [cartId];
    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function isCartItemExistInCart(cartItem, cartId) {

    let sql = "select product_id from cart_items where cart_id = ? and product_id = ?";
    let parameters = [cartId, cartItem.productId]
    let isCartItemFoundData;

    try {
        isCartItemFoundData = await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }

    if (isCartItemFoundData == null || isCartItemFoundData.length == 0) {
        return false;
    }

    return true;
}




async function updateCartItem(cartItem, cartId) {

    let sql = "UPDATE cart_items c JOIN products p ON c.product_id = p.product_id SET c.quantity = (c.quantity + ?), c.total_price = (p.price * (c.quantity + ?)) WHERE c.cart_id = ? and p.product_id = ?";
    let parameters = [cartItem.quantity, cartItem.quantity, cartId, cartItem.productId];

    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}






// let cartItem = { productId: 3, quantity: 2 };
// addCartItem(cartItem, 3);

// let cartItem = { productId: 1, quantity: 1 };
// updateCartItem(cartItem, 1)

// deleteCartItem(1, 5)

// deleteAllCartItems(1)

// getMyCartItems(1)

module.exports = {
    addCartItem,
    deleteCartItem,
    deleteAllCartItems,
    isCartItemExistInCart,
    getMyCartItems,
    updateCartItem,
};