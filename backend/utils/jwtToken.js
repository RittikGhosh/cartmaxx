//create token and save in cookie
//and send response, it will be called in userController file
const sendToken=(user, statusCode, res) => {
     //agar user register kar dia but logged in nh h toh it is not good,so for that we use token,token se humare server ko pata chal jayega ki iss user logged in h or ye admin h
    //server authorises users seeing the token
    //generating token by using getJWTToken fn made in userModel and we will store it in cookie
    const token = user.getJWTToken();  

    //options for cookie
    const options = {
        expires: new Date(         //expiry time will be present time + cookie time 24-hours,60min,60sec,1000milisecond
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;