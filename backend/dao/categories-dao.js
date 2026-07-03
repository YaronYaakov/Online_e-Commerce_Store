const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");



async function getAllCategories() {
  let sql = "select * from categories ";

  try {
    let allCategories = await connection.execute(sql);
    return allCategories;
  }
  catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}


// getAllCategories()

module.exports = {
  getAllCategories
};
