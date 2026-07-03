const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error")


async function addCartItem(cartItem, cart_id) {

    let sql = "INSERT INTO cart_items SET cart_id =?, product_id = ?, quantity =?, total_price =  quantity * (SELECT price FROM products WHERE id = ?)";
    let parameters = [cart_id, cartItem.product_id, cartItem.quantity, cartItem.product_id];
    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);

    }
}



async function getMyCartItems(cart_id) {
    let sql = "select p.id as product_id, p.name, c.quantity, p.picture, c.total_price, p.price from shoppingcarts s join cart_items c  on s.id = c.cart_id  join products p on c.product_id = p.id where s.id = ?";
    let parameters = [cart_id];

    try {
        let allMyProducts = await connection.executeWithParameters(sql, parameters);
        return allMyProducts;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}


async function deleteCartItem(cart_id, product_id) {
    let sql = "delete from cart_items where cart_id = ? and product_id = ?";
    let parameters = [cart_id, product_id];
    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function deleteAllCartItems(cart_id) {
    let sql = "delete from cart_items where cart_id=?";
    let parameters = [cart_id];
    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function isCartItemExistInCart(cartItem, cart_id) {

    let sql = "select product_id from cart_items where cart_id = ? and product_id = ?";
    let parameters = [cart_id, cartItem.product_id]
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




async function updateCartItem(cartItem, cart_id) {

    let sql = "UPDATE cart_items c JOIN products p ON c.product_id = p.id SET c.quantity = (c.quantity + ?), c.total_price = (p.price * (c.quantity + ?)) WHERE c.cart_id = ? and p.id = ?";
    let parameters = [cartItem.quantity, cartItem.quantity, cart_id, cartItem.product_id];

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