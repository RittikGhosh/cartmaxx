const cookieParser = require('cookie-parser');
const express = require('express');
const errorMiddleware = require("./middleware/error")
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");



//config
//using dotenv we can access env file data,we have to use dotenv.config fn which takes the path object which u want to link
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

//Route imports
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const order = require("./routes/orderRoutes")
const payment = require("./routes/PaymentRoute")

//using  routes
app.use("/api/", productRouter);
app.use("/api/", userRouter);
app.use("/api/", order);
app.use("/api/", payment);


//ek hi port mae we can access frontend as well
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

//Middleware for errors
app.use(errorMiddleware);


module.exports = app;