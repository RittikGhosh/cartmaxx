import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

//jab hum protectedRoute use karenge tab hum ek component pass karenge and kuch parameters like exact,path etc 
const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
    const { loading, isAuthenticated ,user} = useSelector((state) => state.user);


    return (
        <Fragment>
            {loading === false && (  //jab loading nh ho raha h tab kam karna
                <Route
                    {...rest}
                    render={(props) => {     //a fn
                        if (isAuthenticated === false) {
                            return <Redirect to="/login" />;   //agar logout h toh /login mae redirect kardena
                        }

                        if (isAdmin === true && user.role !== "admin") {
                            return <Redirect to="/login" />;
                        }

                        return <Component {...props} />;  //nh toh component return kar dena
                    }}

                >
                </Route>
            )}
        </Fragment>
    );
};

export default ProtectedRoute;
