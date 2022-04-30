
import React, { useEffect, useState } from 'react'
// import Carousel from 'react-material-ui-carousel'

//it grabs the id from the url
import { useParams } from 'react-router-dom';
//for getting the data from database to redux store and from store to here 
import { useSelector, useDispatch } from 'react-redux';
//if there is any error we show error and then clear it,getProductDetails is the action which triggers the reducer to grab that particular product from database
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction';
//for the ratings
import ReactStars from "react-rating-stars-component";
//css
import './ProductDetails.css';
//component to show the reviews of the product
import ReviewCard from './ReviewCard.js';
//animated loading when loading
import Loader from '../layout/Loader/Loader';
//to show alert if there is any error
import { useAlert } from 'react-alert';
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";


import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";





function MyComponent() {

    //grabbing the id from url
    let { id } = useParams();
    //getting the data from store
    const { product, loading, error } = useSelector(state => state.productDetails);

    const { success, error: reviewError } = useSelector(
        (state) => state.newReview
    );
    //getting the data from database
    const dispatch = useDispatch();
    const alert = useAlert();


    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    //initially state is 1
    const [quantity, setQuantity] = useState(1);
    //jab increase pe click karega tab ye fn run hoga
    const increaseQuantity = () => {
        if (product.Stock <= quantity) return;  //agar stock quantity kam h toh increase mat karna

        const qty = quantity + 1;
        setQuantity(qty);   //increasing quantity
    };
    const decreaseQuantity = () => {
        if (1 >= quantity) return;

        const qty = quantity - 1;
        setQuantity(qty);
    };

    //add product details to cart state in store,jab hum add to cart pe click karte h toh, addItemsToCart action dispatch ho jata h where we have cartItems array in store and hum usme products add kar dete h to addtocart hua h
    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity));
        alert.success("Item Added To Cart");
    };


    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true);
    };

    const reviewSubmitHandler = () => {
        const myForm = new FormData();

        myForm.set("rating", rating);
        myForm.set("comment", comment);
        myForm.set("productId", id);

        //creating a new review 
        dispatch(newReview(myForm));

        setOpen(false); //review dene k baad submitreview ko band kar dena
    };


    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Review Submitted Successfully");
            dispatch({ type: NEW_REVIEW_RESET });
        }

        dispatch(getProductDetails(id));
    }, [dispatch, id, error, alert, success, reviewError]);

    //reviews details
    // const options = {
    //     // size: "large",
    //     // value: product.ratings,
    //     // readOnly: true,
    //     // precision: 0.5,
    //     edit: false,  //means the stars will not be selected
    //     color: "rgba(20,20,20,0.1)", //default color
    //     activeColor: "tomato",  //color of rating -yellowish
    //     size: window.innerWidth < 600 ? 20 : 25, //changing size of stars according to innerwidth
    //     value: product.ratings, //stars value i.e how much is yellow
    //     isHalf: true,
    // };

    const options = {
        size: "medium",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };

    return (
        <>
            {/* if loading show Loader component else show product */}
            {loading ? <Loader /> :
                <>
                    <MetaData title={`${product.name} -- CARTMAX`} />
                    <div className='ProductDetails'>
                        <div>
                            {/* showing the image  */}
                            {/* <Carousel> */}
                            {product.images &&
                                product.images.map((item, i) => (
                                    <img
                                        className="CarouselImage"
                                        key={i}
                                        src={item.url}
                                        alt={`${i} Slide`}
                                    />
                                ))}
                            {/* </Carousel> */}
                        </div>

                        <div>
                            <div className="detailsBlock-1">
                                {/* showing the product name */}
                                <h2>{product.name}</h2>
                                <p>Product # {product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                {/* showing the reviews */}
                                {/* <ReactStars {...options} /> */}
                                <Rating {...options} />
                                <span className="detailsBlock-2-span">
                                    ({product.numOfReviews} Reviews)
                                </span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>{`₹${product.price}`}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        {/* adding and deleting how many we will take */}
                                        {/* decreaseQuantity fn will invoke when clicked in - and vice versa for + */}
                                        <button onClick={decreaseQuantity}>-</button>
                                        <input readOnly type="number" value={quantity} />
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>{" "}
                                    <button
                                        disabled={product.Stock < 1 ? true : false}  //agar stock 1 se kam h toh addtocart nh hona chahia
                                        onClick={addToCartHandler} //jab add to cart pe click karega toh addToCartHandler fn will run,there we will dispatch action
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                                <p>
                                    {/* showing if the product is in stock or not  */}
                                    Status:{" "}
                                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>


                            </div>
                            <div className="detailsBlock-4">
                                Description : <p>{product.description}</p>
                            </div>

                            <button onClick={submitReviewToggle} className="submitReview">
                                Submit Review
                            </button>
                        </div>
                        {/* <p>{id}</p> */}

                    </div>

                    <h3 className="reviewsHeading">REVIEWS</h3>

                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open} //agar open true h toh we will show submit review
                        onClose={submitReviewToggle} //jab submit review close hoga tab open false ho jayega
                    >
                        <DialogTitle>Submit Review</DialogTitle>
                        <DialogContent className="submitDialog">
                            <Rating
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                size="large"
                            />

                            <textarea
                                className="submitDialogTextArea"
                                cols="30"
                                rows="5"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            {/* cancel mae click karne se open false ho jayega i.e submit review close ho jayega */}
                            <Button onClick={submitReviewToggle} color="secondary">
                                Cancel
                            </Button>
                            {/* submit mae click karne se we will dispatch newreview action which will make a new review */}
                            <Button onClick={reviewSubmitHandler} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>





                    {/* showing the reviews given by the users */}
                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews &&
                                product.reviews.map((review) => (
                                    // here we are going through each review and passing it in ReviewCard component so that it is showen in a beautiful way
                                    <ReviewCard review={review} />
                                ))}
                        </div>
                        // if there is no review of the product then show no reviews yet
                    ) : (
                        <p className="noReviews">No Reviews Yet</p>
                    )}
                </>
            }
        </>
    );
}

export default MyComponent;