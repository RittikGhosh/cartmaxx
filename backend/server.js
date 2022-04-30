//first install express,dotenv,nodemon,mongoose then npm init=give entrypoint-backend/server.js(means in production code ll start from there)
//in package-json write script-start(means instead of server.js u can use start) and dev(means when in development use nodemon but in production use node) 
const app = require("./app");
//u have to setup cloudinary in server.js,app.js and in controllers
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database")


// console.log(lll); it will show an error which is called uncaught error.
// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    //so whenever there is such an error we will display this
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
});



//config
//using dotenv we can access env file data,we have to use dotenv.config fn which takes the path object which u want to link
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

//connecting to database
connectDatabase()

//setting up cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


let port = process.env.PORT || 4000;
//bcoz of dotenv we can access PORT which is in config.env file by using process.env.file_name
const server = app.listen(port, () => {
    console.log(`Server is working on port ${port}`);
})


//say when u put wrong mongo server address it will show an error which is called Unhandled Promise Rejection.
//so whenever there is such an error we will display this
// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});