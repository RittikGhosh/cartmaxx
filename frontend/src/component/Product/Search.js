import React, { Fragment, useState } from "react";
import MetaData from "../layout/MetaData";
import "./Search.css";
//it is used to edit current url 
import { useHistory } from "react-router-dom";
const Search = () => {
    const [keyword, setKeyword] = useState("");



    const history = useHistory();
    const searchSubmitHandler = (e) => {
        //it prevents the default i.e bydefault the same page loads
        e.preventDefault();

        //if keyword is present then add /products/keyword to url which will again trigger products component
        if (keyword.trim()) {
            history.push(`/products/${keyword}`); //we add the keyword in the url
        } else {
            history.push("/products");
        }
    };

    return (
        <Fragment>
            <MetaData title="Search A Product" />
            {/* when you click on search button ,searchSubmitHandler fn will be executed */}
            <form className="searchBox" onSubmit={searchSubmitHandler}>
                <input
                    type="text"
                    placeholder="Search a Product ..."
                    onChange={(e) => setKeyword(e.target.value)} //when u type anything ,in state keyword the value will be preserved
                />
                <input type="submit" value="Search" />
            </form>
        </Fragment>
    );
};

export default Search;
