const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");



async function getAllCities() {
    let sql = "select * from cities ";

    try {
        let allCities = await connection.execute(sql);
        console.log(allCities)
        return allCities;
    }
    catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}


// getAllCities()

module.exports = {
    getAllCities
};
