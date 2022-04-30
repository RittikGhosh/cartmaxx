
import React from 'react';
//we use link instead of anchor tag,we wrap each product in Link component and pass to attribute(it specifies which route to go when we click it)
import { Link } from "react-router-dom";
//used for stars of rating
// import ReactStars from "react-rating-stars-component";
import { Rating } from "@material-ui/lab";

const ProductCard = ({ product }) => {
    const options = {
        size: "small",
        value: product.ratings,
        readOnly: true,
        precision: 0.5,
    };
    
    //it specifies details of stars
    // const options = {
    //     edit: false,  //means the stars will not be selected
    //     color: "rgba(20,20,20,0.1)", //default color
    //     activeColor: "tomato",  //color of rating -yellowish
    //     size: window.innerWidth < 600 ? 20 : 25, //changing size of stars according to innerwidth
    //     value: product.ratings, //stars value i.e how much is yellow
    //     isHalf: true,  //half star yellow is true
    // }
    return (
        <>
            {/* this represents each product in home */}
            <Link className="productCard" to={`/product/${product._id}`}>
                <img src={product.images[0].url} alt={product.name} />
                <p>{product.name}</p>
                <div>
                    {/* <ReactStars {...options} /> */}
                    <Rating {...options} />
                    <span className='productCardSpan'>
                        ({product.numOfReviews} Reviews)
                    </span>
                </div>
                <span>{`₹${product.price}`}</span>
            </Link>
        </>
    )
}

export default ProductCard;