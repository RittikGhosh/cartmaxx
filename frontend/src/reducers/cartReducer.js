import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

export const cartReducer = (
    state = { cartItems: [] },
    action
) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;

            //checking kya wo product pehle se cart mae h
            const isItemExist = state.cartItems.find(
                (i) => i.product === item.product
            );

            if (isItemExist) { //agar pehle se wo product h cart mae tab
                return {
                    ...state,
                    cartItems: state.cartItems.map((i) =>  //tab simply replace kar denge wo item ko naya wala se
                        i.product === isItemExist.product ? item : i
                    ),
                };
            } else {
                return { //agar nh h pehle se toh
                    ...state,
                    cartItems: [...state.cartItems, item], //cartItems array mae simply add kar denge 
                };
            }

        case REMOVE_CART_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((i) => i.product !== action.payload),
            };

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload,
            };

        default:
            return state;
    }
};
