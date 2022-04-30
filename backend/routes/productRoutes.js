const express = require("express");

//fn of api which is imported from controllers
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, getAdminProducts,createProductReview, getProductReviews, deleteReview} = require("../controllers/productController");
const { isAuthenticatedUser ,authorization } = require("../middleware/auth");
const router = express.Router();

//product apis for different urls to perform CRUD operations
router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticatedUser, authorization("admin"), getAdminProducts);


router.route("/admin/product/new").post( createProduct);

router.route("/admin/products/:id")
    .put(isAuthenticatedUser, authorization("admin"), updateProduct)
    .delete(isAuthenticatedUser, authorization("admin"), deleteProduct);
    
router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
    .route("/reviews")
    .get(getProductReviews)
    .delete(isAuthenticatedUser, deleteReview);

    
//exporting it to 
// app.js to use it 
module.exports = router;