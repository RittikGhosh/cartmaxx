const express = require("express");
const {
    newOrder,
    getSingleOrder,
    myOrders,
    getAllOrders,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");
// const { isAuthenticatedUser, authorization } = require("../middleware/auth")
const router = express.Router();

const { isAuthenticatedUser, authorization } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router
    .route("/admin/orders")
    .get(isAuthenticatedUser, authorization("admin"), getAllOrders);

router
    .route("/admin/order/:id")
    .put(isAuthenticatedUser, authorization("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorization("admin"), deleteOrder);

module.exports = router;
