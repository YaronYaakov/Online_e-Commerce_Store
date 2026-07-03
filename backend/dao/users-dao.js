const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

async function addUser(user) {
  let sql = "INSERT INTO users SET user_id =? ,password = ? ,email =? , first_name = ?, last_name =?, street =? , city_id = ?";
  let parameters = [user.user_id, user.password, user.email, user.first_name, user.last_name, user.street, user.city_id];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function login(user) {
  let sql = "SELECT u.user_id, u.first_name, u.last_name, u.city_id, u.street, u.user_type, s.id as 'cart_id',DATE_FORMAT(s.time_stamp, '%Y-%m-%d') AS 'cart_date', s.total_price, s.is_checked_out, DATE_FORMAT(o.order_date, '%Y-%m-%d') AS 'last_order' FROM users u LEFT JOIN shoppingcarts s ON u.user_id = s.user_id LEFT JOIN orders o  ON u.user_id = o.user_id  WHERE u.email = ? and u.password =? ORDER BY s.id DESC LIMIT 1;"
  let parameters = [user.email, user.password];
  let userLoginResult;

  try {
    userLoginResult = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    console.log(e);
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }

  if (userLoginResult == null || userLoginResult.length == 0) {
    throw new ServerError(ErrorType.UNAUTHORIZED);
  }
  return userLoginResult[0];
}

async function isUserEmailExist(email) {
  let sql = "select email from users where email = ? ";
  let parameters = [email];
  let isEmailFoundData;

  try {
    isEmailFoundData = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }

  if (isEmailFoundData == null || isEmailFoundData.length == 0) {
    return false;
  }

  return true;
}

async function isUserIdExist(user_id) {
  let sql = "select id from users where user_id = ? ";
  let parameters = [user_id];
  let isUserIdFoundData;

  try {
    isUserIdFoundData = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }

  if (isUserIdFoundData == null || isUserIdFoundData.length == 0) {
    return false;
  }

  return true;
}

// let user = {userId : 1478523, firstName:'dani' ,lastName : 'el', street:'street', cityName :'Tel-Aviv', password:'45698' , email:'da18@gmail.com'}
// addUser(user);

// login({ email: "avi1@gmail.com", password: "12354" });

// isUserEmailExist("avi1@gmail.com")

// isUserIdExist(312542354)

module.exports = {
  login,
  addUser,
  isUserEmailExist,
  isUserIdExist,
};
