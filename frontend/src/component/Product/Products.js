import React, { useEffect, useState } from "react";
import "./Products.css";


import { useSelector, useDispatch } from "react-redux";
//getProduct will get data from database
import { clearErrors, getProduct } from "../../actions/productAction";

//when loading we will show loading animation used in Loader component
import Loader from "../layout/Loader/Loader";

//shows all products in screen
import ProductCard from "../Home/ProductCard";

//to show error alerts in screen
import { useAlert } from "react-alert";

//to change the title
import MetaData from "../layout/MetaData";

//to grab the keyword if present that got generated from search 
import { useParams } from 'react-router-dom';

//to have different pages in the website
import Pagination from "react-js-pagination";

//it is used in filters
import Typography from "@material-ui/core/Typography"; //it is like a paragraph but has some inbuilt css property
import Slider from "@material-ui/core/Slider"; //it is used for range ,here we are using it in price and rating filters



//the categories filter will have these options
const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
];

const Products = () => {

    const dispatch = useDispatch();

    //price state and  when there is a change in price filter ,we will change the price using setPrice in priceHandler fn
    const [price, setPrice] = useState([100, 100000]);
    const priceHandler = (event, newPrice) => {
        setPrice(newPrice);
    }
    //category state for category filter
    const [category, setCategory] = useState("");
    //rating state for rating filter
    const [ratings, setRatings] = useState(0);

    //pagination
    const [currentPage, setcurrentPage] = useState(1);
    //getting the data from store
    const {
        products,
        loading,
        error,
        productsCount,
        resultperpage,
        // filteredProductsCount,
    } = useSelector((state) => state.products);

    //useParams() will give us the keyword obj(key:value) ,so we have to destructure it
    let { keyword } = useParams(); //grabing the keyword


    //to change page pagination
    const setCurrentPageNo = (e) => {
        setcurrentPage(e);
    }

    const alert = useAlert();
    // getting the data from database
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(getProduct(keyword, currentPage, price, category, ratings));//if there is no keyword we will take "" as default, we pass all this in action where we will make an api call along with these parameters
    }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]); //when any of this is changed ,usestate will rerender



    // let count = filteredProductsCount;
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <MetaData title="PRODUCTS -- CARTMAX" />
                    <h2 className="productsHeading">Products</h2>
                    {/* show all the data one by one in screen  */}
                    <div className="products">
                        {products &&
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                    </div>



                    <div className="filterBox">
                        {/* like a paragraph tag */}
                        <Typography>Price</Typography>

                        {/* it is a range slider  */}
                        <Slider
                            value={price}
                            onChange={priceHandler}  //when any change is there in price range in frontend ,this fn will run
                            valueLabelDisplay="auto"  //see documentation for more info
                            aria-labelledby="range-slider"
                            min={100}
                            max={100000}
                        />

                        <Typography>Categories</Typography>
                        <ul className="categoryBox">
                            {categories.map((category) => ( //we are iterating in categories array
                                <li
                                    className="category-link"
                                    key={category}   //there is a category state value
                                    onClick={() => setCategory(category)}    //when we click in a particular category , we change the state category by using setCategory
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>

                        <fieldset>
                            <Typography component="legend">Ratings Above</Typography>
                            <Slider
                                value={ratings}
                                onChange={(e, newRating) => {  //when rating is changed change its state value too
                                    setRatings(newRating);
                                }}
                                aria-labelledby="continuous-slider" //type of slider
                                valueLabelDisplay="auto"  //see the documentation
                                min={0}
                                max={5}
                            />
                        </fieldset>
                    </div>


                    {/* pagination,when resultperpage is less than equal to productsCount then show pagination  */}
                    {resultperpage <= productsCount && (
                        <div className="paginationBox">
                            <Pagination
                                totalItemsCount={productsCount}
                                activePage={currentPage}
                                itemsCountPerPage={resultperpage}
                                onChange={setCurrentPageNo}   //when u click on page no. in frontend, it will envoke setCurrentPageNo fn where currentpage state value will change 
                                nextPageText="Next"
                                prevPageText="Prev"
                                firstPageText="1st"
                                lastPageText="Last"
                                itemClass="page-item"
                                linkClass="page-link"
                                activeClass="pageItemActive"
                                activeLinkClass="pageLinkActive"
                            />
                        </div>
                    )}

                </>
            )
            }
        </>
    );
}

export default Products;