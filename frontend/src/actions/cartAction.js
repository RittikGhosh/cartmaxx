import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import axios from "axios";

// Add to Cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    //wo particular product details lega
    const { data } = await axios.get(`/api/product/${id}`);

    //and cartItems array mae uska ek obj banake add kar dega ,usme quantity,stock etc dikhayega
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.Stock,
            quantity,
        },
    });
//local storage mae save kar rahe h nh toh load karne se state se chala jayega,cart se jana nh chahia load karne se bh
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));//getState() se state ko access kar sakte h
};

// REMOVE FROM CART
export const removeItemsFromCart = (id) => async (dispatch, getState) => {  
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id,
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// SAVE SHIPPING INFO
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem("shippingInfo", JSON.stringify(data));
};
