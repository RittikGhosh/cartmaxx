import React from "react";
//used to change title according to each component
import Helmet from "react-helmet";

//we will import this Metadata component whereever we will use this and pass  title as arguements .then when that component is used the title will be what we pass in metadata component 
const MetaData = ({ title }) => {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    );
};

export default MetaData;