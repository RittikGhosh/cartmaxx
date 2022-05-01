const User = require("../models/userModel");
const ErrorHander = require("../utils/errorHaldler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//Register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    //files will be uploaded in avatars folder in cloudinary from frontend 
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    });

    //grabbing name email password from frontend
    const { name, email, password } = req.body;

    //creating user in database
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id, //these are id and url from cloudinary
            url: myCloud.secure_url,
        },
    })
    //this fn will make token and store it in cookie and send response
    sendToken(user, 201, res);

});


// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400));
    }

    //if we have both email and password then we will check in database for user who have similar email
    const user = await User.findOne({ email }).select("+password"); //here we are not writing password directly as we used select:false in schema of password thatswhy use will use select method .select("+password") which Specifies which document fields to include even if there select is false

    //then we will check for valid user
    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }


    //using comparePassword fn which is made in usermodel,it returns true if password matches
    const isPasswordMatched = await user.comparePassword(password);

    //then we will check for valid password
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    //here we are removing the token from the cookie    
    res.cookie("token", null, {
        expires: new Date(Date.now()),  //it expires now
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});



// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    //finding the user
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();  //this fn is defined in usermodel


    //saving the hashed token in user data as in the getResetPasswordToken fn we just add the hash in resetPasswordToken but did not save it to this user's data
    await user.save({ validateBeforeSave: false });


    //creating the url that the user will click, 
    // as frontend mae server 3000 pe chal raha h isilia avi asa nh karenge ,production mae asa karenge
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;  //we have made a route of this in userroutes



    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;


    //the messege that we will send in email
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({ //invoking a method where we will pass email,subject,messege and that fn will send the email using nodemailer
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {  //if there is an error
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false }); //saving the above 2 lines 

        return next(new ErrorHander(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    //finding the user from database also if resetPasswordExpire is passed then it will return nothing
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });


    if (!user) {
        //if we dont find the user or token is expired 
        return next(
            new ErrorHander(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    //new password and confirm password should be same
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not match confirm password", 400));
    }

    //changing the password
    user.password = req.body.password;

    //after reseting thepassword we have to set  resetPasswordToken,resetPasswordExpire to undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    //to login him after changing password, we save user token to cookie
    sendToken(user, 200, res);

    //story-so to reset password we will first pass email in forgot password then forgotPassword api will create a reset token and make a url with it and send it to the user's email and then when we click the url the resetpassword api gets triggered where we pass password and confirm password to change the password
});



// Get User Detail 
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => { //to access user details the user should be logged in first
    const user = await User.findById(req.user.id);  //when user is logged in in authenticate fn we assign user details in req.user ,so with req.user.id we can get the user id to find the user from database

    res.status(200).json({
        success: true,
        user,
    });
});

// update User password
//in input user will give three things old password,new password,confirm password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password"); //here we also need the password thatswhy we used .select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("password does not match", 400));
    }

    //if all the things are correct it will update the password and save it in database
    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});


// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    console.log(req.body.avatar);
    //agar image h toh, pehle user se imageId leke cloudinary se wo image delete kar
    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        //phr naya image upload kar and uska public id and url save kar current profile mae
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    //so here if the user who is logged in is admin then he can get/see all users
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    //so here if the user who is logged-in is admin then he can get a specific user using his/her id
    const user = await User.findById(req.params.id); //the id has to be passed in route,we can access it by using params

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    //so here if the user who is logged-in is admin then he can update a user's role,name,email

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    //updating the user's data
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    //so here if the user who is logged-in is admin then he can delete a user
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }
    //before removing the user we will delete its profile image from cloudinary
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
});
