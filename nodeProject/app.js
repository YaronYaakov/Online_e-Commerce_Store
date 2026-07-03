const express = require("express");
const cors = require("cors");
const loginFilter = require("./middleware/login-filter");

const fs = require("fs");
// using a middleware which helps managing the file upload
const fileUpload = require("express-fileupload");

const usersController = require("./controllers/users-controller");
const ordersController = require("./controllers/orders-controller");
const productsController = require("./controllers/products-controller");
const categoriesController = require("./controllers/categories-controller");
const shoppingCartsController = require("./controllers/shoppingCarts-controller");
const cartItemsController = require("./controllers/cartItems-controller");
const citiesController = require("./controllers/cities-controller");
const statisticsController = require("./controllers/statistics-controller");
const errorHandler = require("./errors/error-handler");

const server = express();




if (!fs.existsSync("./uploads")) {
  // Must create "/uploads" folder if it does not exist.
  fs.mkdirSync("./uploads");
}
server.use("/uploads", express.static("uploads"));

server.use(cors());

// Extract the JSON from the body and create request.body object containing it:
server.use(express.json());

server.use(loginFilter());

// Registering the file upload middleware
server.use(fileUpload());

//All resources
server.use("/users", usersController);
server.use("/orders", ordersController);
server.use("/products", productsController);
server.use("/categories", categoriesController);
server.use("/shoppingCarts", shoppingCartsController);
server.use("/statistics", statisticsController);
server.use("/cartItems", cartItemsController);
server.use("/cities", citiesController);

server.use(errorHandler);

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
