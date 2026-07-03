let usersLogic = require("../logic/users-logic");
const express = require("express");


const router = express.Router();



// CREATE USER/SIGN UP
// POST http://localhost:3000/users
router.post("/", async (request, response, next) => {

    // Extracting the JSON from the packet's BODY
    let user = request.body;

    try {
        await usersLogic.addUser(user);
        response.json();
    } catch (error) {
        return next(error);
    }
});


// LOGIN
// POST http://localhost:3000/users/login
router.post("/login", async (request, response, next) => {

    // Extracting the JSON from the packet's BODY
    let user = request.body;

    try {
        let successfullLoginData = await usersLogic.login(user);
        response.json(successfullLoginData);
    } catch (error) {
        return next(error);
    }
});

// LOGOUT
// POST http://localhost:3000/users/logout
router.post("/logout", async (request, response, next) => {

    // Extracting the JSON from the packet's BODY
    let userToken = request.body;
    try {
        await usersLogic.logout(userToken);
        response.json();

    } catch (error) {
        return next(error);
    }
});


module.exports = router;