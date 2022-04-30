const ErrorHandler = require("../utils/errorHaldler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//here we make a fn isAuthenticatedUser(authenticate means verifing who someone is) to check if user is logged in or not so that if he is not logged in he cant do certain things
//we check that by first accessing the token from the req which is stored in cookies.
//jab tak logged in h tumhara browser k cookies mae token hoga and hum req.cookies se usse access kar sakte h
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    
    if (!token) {   //agar token nh h toh show this error
        return next(new ErrorHandler("pleasee login to access the resource", 401));
    }

    //then we check ye token konsa user ka h isilia we access the obj with the help of token and secret key which contains the user id  
  const decodedData=jwt.verify(token,process.env.JWT_SECRET)

    //phr with the help of id we find that user and give access to him
    req.user = await User.findById(decodedData.id);
    // console.log(req.user);
    next();
}); 

//authorization means verifing what files/power user can access
//we will pass "admin" as arguement and ...roles means we made an array i.e. roles=[ 'admin' ] so that we can use array fn indludes to check if user has admin as role
//we are just checking if user is admin or not
exports.authorization = (...roles) => {
    return (req, res, next) => {
        //when we are logged in we save user in req.user and we can access its role
        if (!roles.includes(req.user.role)) {
            //if user does not contain admin as role then error is triggered
            return next(    //using next  we terminate the fn
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403   //refused by server
                )
            );
        }
        //if user has admin as role then do nothing 
        next();
    };
};