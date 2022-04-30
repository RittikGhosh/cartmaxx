// import { Rating } from "@material-ui/lab";
//showing the reviews given by the user to each product
import React from "react";
// import ReactStars from "react-rating-stars-component";
import profilePng from "../../images/Profile.png";
import { Rating } from "@material-ui/lab";

const ReviewCard = ({ review }) => {
     
    const options = {
        value: review.rating,
        readOnly: true,
        precision: 0.5,
    };

    return (
        <div className="reviewCard">
            <img src={profilePng} alt="User" />
            <p>{review.name}</p>
            {/* <ReactStars {...options} /> */}
            <Rating {...options} />
            <span className="reviewCardComment">{review.comment}</span>
        </div>
    );
};

export default ReviewCard;
