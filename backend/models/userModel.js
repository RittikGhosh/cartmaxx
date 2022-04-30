const mongoose = require("mongoose");
const validator = require("validator");    //to  validate email
const bcrypt = require("bcrypt");        //to convert password into hash
const jwt = require("jsonwebtoken");       //for tokens
const crypto = require("crypto");          //inbuilt module to generete tokens for reset password
//nodemailer -to send links automatically for forgot password
//cookie-parser  -to store tokens

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"], //using validator.isEmail to check if it is a valid email
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],

        select: false,   //it means when admin searches for a user the password will will be shown
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

//when u reset password
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//.pre is a event listener ,so before saving the callback fn will run
userSchema.pre("save", async function (next) {
    //if password is not modified/reset then we will not hash the already hashed password
    if (!this.isModified("password")) {
        next();
    }

    //hashing password before saving in data base
    this.password = await bcrypt.hash(this.password, 10); //10 is the power,more power more secure, 10 is standard
});

//JWT TOKEN
//by using userSchema.methods we can make our custom methods that can be used on user objects
userSchema.methods.getJWTToken = function () {    //making a getJWTToken fn to generate token
    //by using sign method of jwt we make a token
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {    //we pass id of that user i.e payload , secretKey(very imp key,if anyone has this key they can make many fake admins accounts)
        expiresIn: process.env.JWT_EXPIRE,  //and expireIn i.e. after how much time will the token  expire/the user will be logged out 
    });
};

//Compare Password
userSchema.methods.comparePassword = async function (password) {  //we are making  comparePassword fn so that we can use this on user 
    //to compare the entered password in login and hashed password in database of that user 
    return await bcrypt.compare(password, this.password); //it return true or false
};

// Generating Password Reset Token -that will be sent to user email and when he/she clicks it they can reset their password
userSchema.methods.getResetPasswordToken = function () {
    //crypto.randomBytes(20) generates 20 buffer value we convert that into hex value by using .toString("hex")
    // it will generate  token with size 20
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing the resetToken  and adding it in resetPasswordToken of userSchema 
    this.resetPasswordToken = crypto
        .createHash("sha256") //sha256 is an algorithm to convert data into hash
        .update(resetToken)  //passing what we will update
        .digest("hex");     //it should be in hex not buffer

    //defining the time of expiry of the token,after the expiry the user cannot reset his password with that token
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);
