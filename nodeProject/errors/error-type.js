let ErrorType = {

    GENERAL_ERROR: { id: 1, httpCode: 654, message: "A general error ....", isShowStackTrace: true },
    UNAUTHORIZED: { id: 2, httpCode: 401, message: "Login failed, invalid email or password", isShowStackTrace: false },
    EMAIL_ALREADY_EXISTS: { id: 3, httpCode: 602, message: "The email already exists", isShowStackTrace: false },
    ID_ALREADY_EXISTS: { id: 4, httpCode: 603, message: "The ID already exists", isShowStackTrace: false },
    PRODUCT_ALREADY_EXISTS: { id: 5, httpCode: 604, message: "Product already exists", isShowStackTrace: false },
    ORDER_ALREADY_EXISTS: { id: 6, httpCode: 607, message: "You've already ordered", isShowStackTrace: true },
    UNAUTHORIZED_USERTYPE: { id: 7, httpCode: 401, message: "You're not an administrator", isShowStackTrace: false },
    UNKNOWN_VALUE: { id: 8, httpCode: 608, message: "The value is unknown", isShowStackTrace: false }

}
module.exports = ErrorType;


