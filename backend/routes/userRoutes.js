const express = require("express");

//fn of api which is imported from controllers
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser,getSingleUser,updateUserRole,deleteUser} = require("../controllers/userController");
const { isAuthenticatedUser, authorization } = require("../middleware/auth");

const router = express.Router();

//user routes for different urls to perform CRUD operations
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/profile/update").put(isAuthenticatedUser, updateProfile);


router
    .route("/admin/users")
    .get(isAuthenticatedUser, authorization("admin"), getAllUser);

router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, authorization("admin"), getSingleUser)
    .put(isAuthenticatedUser, authorization("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorization("admin"), deleteUser);


//exporting it to app.js to use it 
module.exports = router;