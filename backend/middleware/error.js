const ErrorHandler = require("../utils/errorHaldler");

//here err is an obj of class Errorhandler passed in next fn 
module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //if we give wrong id(shorter or longer) in api calls  it will show the following
    // Wrong Mongodb Id error
    if (err.name === "CastError") { //this type of error is called casterror
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose duplicate key error i.e if you try to register again with same email
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT error  -if you enter wrong token in route for reset password
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again `;
        err = new ErrorHandler(message, 400);
    }

    // JWT EXPIRE error-if you resetpassword token is expired
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again `;
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        //err.stack gives the whole path of the error using the captureStackTrace
        errorPath: err.stack
    });
}