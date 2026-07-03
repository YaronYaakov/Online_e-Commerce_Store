const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error")


async function addShoppingCart(user_id) {
    let sql = "insert into shoppingcarts (user_id) values(?)";
    let parameters = [user_id];
    try {
        await connection.executeWithParameters(sql, parameters);
    }
    catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);

    }
}

async function getShoppingCart(user_id) {
    let sql = "select s.id as 'cart_id', s.is_checked_out ,s.total_price, DATE_FORMAT(s.time_stamp, '%Y-%m-%d') AS 'cart_date' , DATE_FORMAT(o.order_date, '%Y-%m-%d') AS 'order_date' from shoppingcarts s left join orders o on s.id = o.cart_id where s.user_id=? order by s.id desc limit 1;";
    let parameters = [user_id];
    try {
        let cartDetails = await connection.executeWithParameters(sql, parameters); 
        return cartDetails[0];

    }
    catch (e) {
        console.log(e)
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);

    }
}


async function updateShoppingCart(is_checked_out, cart_id) {
    let sql = "update shoppingcarts set total_price = IFNULL((select sum(total_price)  from cart_items where cart_id = ?), 0) , is_checked_out = ? where id = ?;";
    let parameters = [cart_id, is_checked_out, cart_id];

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