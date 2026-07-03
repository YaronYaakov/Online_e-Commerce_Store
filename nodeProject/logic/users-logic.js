const usersDao = require("../dao/users-dao");
const cacheModule = require("../dao/cache-module");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");

const RIGHT_SALT = "ksdjfhbAWEDCAS29!@$addlkmn";
const LEFT_SALT = "32577098ASFKJkjsdhfk#$dc";





async function login(user) {
    let userData = await usersDao.login(user);

    let saltedEmail = LEFT_SALT + user.email + RIGHT_SALT;
    const jwtToken = jwt.sign({ sub: saltedEmail }, config.secret);

    // console.log("Token before adding to cache : " + jwtToken);
    // console.log("User Data before adding to cache : " + JSON.stringify(userData));

    let object = { userId: userData.user_id, shoppingCartId: userData.cart_id };

    let successfullLoginResponse = {
        token: jwtToken,
        firstName: userData.first_name,
        lastName: userData.last_name,
        cityId: userData.city_id,
        street: userData.street,
        cartDate: userData.cart_date,
        street: userData.street,
        totalPrice: userData.total_price,
        isCheckedOut: userData.is_checked_out,
        orderDate: userData.last_order,
    };
    if (userData.user_type == "ADMIN") {
        object.userType = "ADMIN";
    } else {
        successfullLoginResponse.userType = "CUSTOMER";
    }

    cacheModule.set(jwtToken, object);

    cacheModule.printAll()
    return successfullLoginResponse;
}

async function addUser(user) {
    // Validations
    if (await usersDao.isUserEmailExist(user.email)) {
        console.log("EMAIL_ALREADY_EXISTS");
        throw new ServerError(ErrorType.EMAIL_ALREADY_EXISTS);
    }

    if (await usersDao.isUserIdExist(user.userId)) {
        console.log("ID_ALREADY_EXISTS");
        throw new ServerError(ErrorType.ID_ALREADY_EXISTS);
    }

    await usersDao.addUser(user);
}



function disconnect(userToken) {
    // Validations
    if (userToken) {
        cacheModule.deleteByKey(userToken.token);
        cacheModule.printAll()

    } else {
        throw new ServerError(ErrorType.UNKNOWN_VALUE);
    }


}

// let user = {userId : 3214567, firstName:'dani' ,lastName : 'el', street:'street', cityName :'Tel-Aviv', password:'45698' , email:'da48@gmail.com'}
// addUser(user);

// login({ email: "avi1@gmail.com", password: "12354" });

module.exports = {
    login,
    addUser,
    disconnect
};