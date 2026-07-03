const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error")


async function addShoppingCart(userId) {
    let sql = "insert into shopping_carts (user_id) values(?)";
    let parameters = [userId];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);

    }
}

async function getShoppingCart(userId) {
    let sql = "select s.cart_id, s.is_checked_out ,s.total_price, DATE_FORMAT(s.timestamp, '%Y-%m-%d') AS 'cartDate' , DATE_FORMAT(o.order_date, '%Y-%m-%d') AS 'orderDate' from shopping_carts s left join orders o on s.cart_id = o.cart_id where s.user_id=? order by s.cart_id desc limit 1 ";
    let parameters = [userId];
    try {
        let cartDetails = await connection.executeWithParameters(sql, parameters);
        return cartDetails[0];

    }
    catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);

    }
}


async function updateShoppingCart(isCheckedOut, cartId) {
    let sql = "update shopping_carts set total_price = IFNULL((select sum(total_price)  from cart_items where cart_id =?), 0) , is_checked_out = ? where cart_id = ?";
    let parameters = [cartId, isCheckedOut, cartId];

    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

// addShoppingCart(3214567) 

// updateShoppingCart(1,1)

//  getShoppingCart(312542354)


module.exports = {
    addShoppingCart,
    updateShoppingCart,
    getShoppingCart
};