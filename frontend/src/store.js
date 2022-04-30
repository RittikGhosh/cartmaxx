//in redux basically what happens is we set up our store first,there we have the pass the reducers name.then we wrap our root component in Provider component
//then we make reducers which are basically used to change state, we trigger them by using useDispatch fn and running dispatch
import { createStore, combineReducers, applyMiddleware } from "redux";

import thunk from 'redux-thunk';
//it is to connect to our redux extension
import { composeWithDevTools } from 'redux-devtools-extension';
//these are the reducers
import {
    newProductReducer,
    newReviewReducer,
    productDetailsReducer,
    productReducer,
    productReviewsReducer,
    productsReducer,
    reviewReducer,
} from "./reducers/productReducer";

import {
    userReducer,
    profileReducer,
    forgotPasswordReducer,
    allUsersReducer,
    userDetailsReducer,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer"
import {
    newOrderReducer,
    myOrdersReducer,
    orderDetailsReducer,
    allOrdersReducer,
    orderReducer,
} from "./reducers/orderReducer"

//combineReducers combines all the reducers
const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
});

//initial state of our data
let initialState = {
    //cart ki initial state empty nh hoga agar pehle se kuch h toh
    cart: {
        cartItems: localStorage.getItem("cartItems")
            ? JSON.parse(localStorage.getItem("cartItems")) //agar local storage mae cartItems hua toh initial state wo hoga nh toh empty array
            : [],
        shippingInfo: localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
    },
};
const middleware = [thunk];

//this is how you set up your store
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

//export it to index.js
export default store;