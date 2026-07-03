const connection = require("./connection-wrapper");
const ErrorType = require("./../errors/error-type");
const ServerError = require("./../errors/server-error");

// Only by admin
async function addProduct(product) {
    let sql = "INSERT INTO products SET name = ?, price=? ,category_id = ? ,picture =?";
    let parameters = [product.name, product.price, product.category_id, product.picture];

    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

// Only by admin
async function updateProduct(product) {
    let sql = " update products set  price =? , picture=?,category_id =? , name =?  where product_id =? ";
    let parameters = [product.price, product.picture, product.category_id, product.name, product.product_id];

    try {
        await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}



async function getAllProducts() {
    let sql = "select * from products";

    try {
        let allProducts = await connection.execute(sql);
        return allProducts;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function getAmountOfProducts() {
    let sql = "SELECT count(product_id) as productAmount FROM products ;";

    try {
        let productAmount = await connection.execute(sql);
        return productAmount[0].productAmount;
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}

async function isProductExistByName(name) {
    let sql = "select product_id from products where name = ? ";
    let parameters = [name];
    let isProductFoundData;

    try {
        isProductFoundData = await connection.executeWithParameters(sql, parameters);
    } catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }

    if (isProductFoundData == null || isProductFoundData.length == 0) {
        return false;
    }

    return true;
}





// let product = { name: 'banana', price: 3.5, categoryId: 1 };
// let filePath = 'https://target.scene7.com/is/image/Target/GUEST_f5d0cfc3-9d02-4ee0-a6c6-ed5dc09971d1?wid=488&hei=488&fmt=pjpeg'
// addProduct(product, filePath);

// let product ={  name: 'asd', price: 4.50, categoryName: 'fish', picture: 'https://www.collinsdictionary.com/images/thumb/54.jpg'};
// updateProduct(product);

// getAmountOfProducts()

// getAllProducts()



module.exports = {
    addProduct,
    updateProduct,
    getAmountOfProducts,
    isProductExistByName,
    getAllProducts,
};