import React, { useEffect } from 'react';
import "./Home.css";
//for scrollbar logo

//to take data of products and display it properly
import Product from "./ProductCard.js"

//for title
import MetaData from "../layout/MetaData";

//name of the fn that fetches product and uses dispatch
import { clearErrors, getProduct } from '../../actions/productAction';
//useDispatch is the fn that triggers the reducer,and useSelector is used to get data from store in here
import { useDispatch, useSelector } from "react-redux";

//this component is a loading animation
import Loader from "../layout/Loader/Loader";

//to give alert in screen if any error happens in backend
import { useAlert } from 'react-alert';

const Home = () => {
    //use useAlert fn and then use alert in useeffect
    const alert = useAlert();
    //here we are accessing data from store using useSelector,we access all products and pass it it Product component
    const { loading, error, products } = useSelector(state => state.products);

    //here we are calling dispatch and passing getProduct fn which will trigger that reducer
    const dispatch = useDispatch();
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    }, [dispatch, error, alert]); //if error or dispatch use this


    return (
        <>
            {/* if loading is true use the loading animation else show the home page */}
            {loading ? (<Loader />) : (
                <>
                    {/* it will be the title when we are in home component */}
                    <MetaData title="CARTMAX" />
                    <div className="banner">
                        <p>Welcome to CARTMAXX</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>
                        <a href="#container">
                            <button >
                                Scroll
                            </button>
                        </a>
                    </div>

                    <h2 className='homeHeading'>Featured Products</h2>
                    {/* <img src="https://i.ibb.co/DRST11n/1.webp" alt="dd" /> */}
                    <div className="container" id="container">
                        {/* if products array is true then use map fn and pass each product/obj in Product component where it gets displayed */}
                        {products &&
                            products.map((product) => (
                                <Product key={product._id} product={product} />
                            ))}

                    </div>
                </>
            )}
        </>
    )
}

export default Home;