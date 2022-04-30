//importing models from models folder
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHaldler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
//here i am making the callback fn of the product api and exporting it to product routes
const cloudinary = require("cloudinary");


//when you use create product api and ommit name as input whose validation required is true u get an  UnhandledPromiseRejectionWarning error and it shuts your server down
//thatswhy u have to use try catch in async fn but to do that repeatedly is not good
//so make a fn which takes the whole code as arguement and then first resolves it(try) i.e. runs it if it fails then catches the error(catch)
//so this way we are writing try catch only once



//Create product -Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    //we assign user id in the product field user
    // req.body.user = req.user.id;
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }

    req.body.images = imagesLinks;

    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })
});




//Get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments(); //it counts the total no. of items 

    //here we are passing all data in query
    //and then calling the search fn which returns the whole apifeature obj with modified query i.e it puts name filter in find fn
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()


   

    apiFeature.pagination(resultPerPage);

    //then we use the apiFeature.query which is the changed query
    let products = await apiFeature.query;

    // let filteredProductsCount = products.length;

    // products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        // filteredProductsCount,
    })
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

//Get  product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }

    res.status(200).json({
        success: true,
        product

    })
});

//Update product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

   
    //instead of writing the if condition ,we can setup a ErrorHandler class so that whenever there is an error then you can simply make an obj of errorhandler class and pass messege,statuscode as consructor
    //and pass the obj in next fn which is written in middleware/error.js
    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }

    // Images Start Here
    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLinks;
    }



    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product

    })
});

//delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404));
    }

    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    product.remove();

    res.status(200).json({
        success: true,
        message: "Product Delete Successfully",
    })
});


// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    //we will pass three things  rating, comment, productId in body
    const { rating, comment, productId } = req.body;

    //then we create the review
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    //find the product in the database by using the productId 
    const product = await Product.findById(productId);


    const isReviewed = product.reviews.find( //yaha hum wo product ka reviews ka array mae jake check kar rahe h ki wo user jo avi review karne wale h wo h ki nh
        (rev) => rev.user.toString() === req.user._id.toString() //req.user._id will get us the id of the user
    );

    if (isReviewed) { //if there is already review given by the user then we will replace it with the new review 
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {//otherwise we will add the new review in the  reviews array
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;   //getting the total rating of the product
    });

    product.ratings = avg / product.reviews.length;   //averaging it

    await product.save({ validateBeforeSave: false });  //saving it in database

    res.status(200).json({
        success: true,
    });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);  //get the product with the help of parameter id

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews, //display its reviews array
    });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);  //req.query.productId means here in query/parameter of api, the product id passed

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()  //in api para review id is also passed
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );

    res.status(200).json({
        success: true,
    });
});
