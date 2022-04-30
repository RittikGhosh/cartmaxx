//it extends Error class which is an inbuilt node js class so that it can use its fns
class ErrorHandler extends Error{
    constructor(message, statusCode) {
        //it is an constructor of Error class and we pass the message parameter to it 
        super(message);
        this.statusCode = statusCode;
        //we inherited Error clas thatswhy we can use its fn.here using the captureStackTrace fn we get the full path of the stack where the error has occured
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;