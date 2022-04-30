const mongoose = require("mongoose");



//making a fn that connects to mongodb servers
const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((data) => {
            console.log(`mongodb connected with server at ${data.connection.host}`);
        })
};

//exporting it to server.js
module.exports = connectDatabase;
