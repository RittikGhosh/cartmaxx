import './App.css';
import React from 'react';
//to use the webfont so that we can have fonts from google
import { useEffect, useState } from "react";

//this components has the overlay navbar 
import Header from "./component/layout/Header/Header.js";
//to use overlay navbar we need to wrap its component in Router ,Route and Routes are used for handling routes
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import WebFont from "webfontloader";  //to load fonts
//footer component
import Footer from "./component/layout/Footer/Footer.js"
//this component contails home page details
import Home from "./component/Home/Home.js";
// import Loader from './component/layout/Loader/Loader';
import ProductDetails from "./component/Product/ProductDetails";

import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from './component/User/LoginSignUp';

//to use loaduser action(this is another way of doing it)
// import store from "./store";
import { loadUser } from "./actions/userAction"
//jo login h uske lia srf useroptions
import UserOptions from "./component/layout/Header/UserOptions";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./component/User/Profile";
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import axios from "axios";
import Payment from "./component/Cart/Payment";

//we have to wrap payment component in element component,hum ye sab payment mae stripe use karne k lia kar raha h
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"; //pass loadstripe as para with value stripeapikey

import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import Dashboard from "./component/Admin/Dashboard.js";

import OrderList from "./component/Admin/OrderList";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";


import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/Not Found/NotFound";



function App() {

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }


  const dispatch = useDispatch();
  //getting data from store for useroptions
  const { isAuthenticated, user } = useSelector((state) => state.user);



  useEffect(() => {
    WebFont.load({ //it loads the font,we use load fn 
      google: {             //here we specify which fonts we will use
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    //yaha pe hum get user details api call kar raha h,qki nh toh jab load karte h page ko store se user chala jata h phr isAuthenticated nh hota h then login hone k badh bh we can again login, 
    //so isilia jab bh load hoga user store mae hoga agar login h toh, 
    dispatch(loadUser());

    getStripeApiKey();
  }, [dispatch]);

  //isse koi mouse mae right click karke inspect nh kar sakta
  // window.addEventListener("contextmenu", (e) => e.preventDefault()); 

  return (
    <Router>
      {/* <Header /> */}
      {/* agar isAuthenticated true h(login h toh) then load useroption component(options for logout,profile) */}
      {isAuthenticated && <UserOptions user={user} />}
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          {isAuthenticated && <Route exact path="/process/payment">
            < Payment />
          </Route>}
        </Elements>
      )}

      {/* we use switch so that it does not render two components together,like /order/confirm and /order/:id */}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        {/* if anyone clicks on a specific product ,then in the url /product/its id will be triggered. and when that route is triggered we show ProductDetails component */}
        <Route exact path="/product/:id">
          <ProductDetails />
        </Route>
        {/* if any one clicks on products ,this component will be shown */}
        <Route exact path="/products">
          <Products />
        </Route>

        {/* if anyone searches a product ,this url will be activted , and in products component we will take the keyword and pass it in reducer */}
        <Route path="/products/:keyword">
          <Products />
        </Route>
        {/* if any one clicks on search button,this component will be shown */}
        <Route exact path="/search">
          <Search />
        </Route>

        <Route exact path="/contact" component={Contact} />

        <Route exact path="/about" component={About} />

        {/* if any one clicks on  login button,this component will be shown */}
        <Route exact path="/login">
          <LoginSignUp />
        </Route>


        {/* agar login h tabhi srf /account and /me/update dikhana nh toh mat dikhana */}
        {/* agar asa nh karenge toh user store mae ane se pehle Profile component render ho jayega and it will not get user  */}
        {isAuthenticated && <Route exact path="/account">
          <Profile />
        </Route>}
        {isAuthenticated && <Route exact path="/me/update">
          <UpdateProfile />
        </Route>}
        {isAuthenticated && <Route exact path="/password/update">
          <UpdatePassword />
        </Route>}

        <Route exact path="/password/forgot">
          <ForgotPassword />
        </Route>
        <Route exact path="/password/reset/:token">
          <ResetPassword />
        </Route>
        <Route exact path="/Cart">
          <Cart />
        </Route>

        {isAuthenticated && <Route exact path="/shipping">
          <Shipping />
        </Route>}
        {isAuthenticated && <Route exact path="/order/confirm">
          <ConfirmOrder />
        </Route>}
        {isAuthenticated && <Route exact path="/success">
          <OrderSuccess />
        </Route>}
        {isAuthenticated && <Route exact path="/orders">
          <MyOrders />
        </Route>}
        {isAuthenticated && <Route exact path="/order/:id">
          <OrderDetails />
        </Route>}


        <ProtectedRoute
          isAdmin={true}
          exact
          path="/admin/dashboard"
          component={Dashboard}
        />


        <ProtectedRoute
          exact
          path="/admin/products"
          isAdmin={true}
          component={ProductList}
        />
        <ProtectedRoute
          exact
          path="/admin/product"
          isAdmin={true}
          component={NewProduct}
        />
        <ProtectedRoute
          exact
          path="/admin/product/:id"
          isAdmin={true}
          component={UpdateProduct}
        />

        <ProtectedRoute
          exact
          path="/admin/orders"
          isAdmin={true}
          component={OrderList}
        />

        <ProtectedRoute
          exact
          path="/admin/order/:id"
          isAdmin={true}
          component={ProcessOrder}
        />

        <ProtectedRoute
          exact
          path="/admin/users"
          isAdmin={true}
          component={UsersList}
        />
        <ProtectedRoute
          exact
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
        />

        <ProtectedRoute
          exact
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
        />
        <Route
          //iska matlab agar /process/payment aye toh NotFound load mat karna, as only this /process/payment is outside switch statement,
          // galat route mae notfound load hamesha hoga
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        />
      </Switch>
      <Footer />
    </Router>
  )
}

//jab bh hum koi link pe click karte h in frontend(lets say edit profile) ,we use Link component to make that link where we have to pass konsa route pe jana h when that link is clicked
//phr jab wo route/url pe hum jate h tab yaha app.js mae hum Routes set up karte h ,i.e agar ye route h toh ye component render hoga, this way we switch between different routes
export default App;
