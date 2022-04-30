import React, { Fragment, useState } from "react";
import "./Header.css";
//to make useroptions jo click karne se bahut sara options dikhaye 
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
//icons from material ui
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { logout } from "../../../actions/userAction";
import { useDispatch,useSelector } from "react-redux";

const UserOptions = ({ user }) => {
    const { cartItems } = useSelector((state) => state.cart);  //getting cartitems array  from store

    const [open, setOpen] = useState(false);
    const history = useHistory();
    const alert = useAlert();
    const dispatch = useDispatch();

    const options = [ //it contains obj which is  different options like order,profile etc
        { icon: <ListAltIcon />, name: "Orders", func: orders }, //it contains icon,name and fn(defined below)
        { icon: <PersonIcon />, name: "Profile", func: account }, 
        {
            icon: (
                <ShoppingCartIcon
                    style={{ color: cartItems.length > 0 ? "tomato" : "unset" }} //agar addtocart mae kuch h toh color tomoto nh toh color nothing
                />
            ),
            name: `Cart(${cartItems.length})`,
            func: cart,
        },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];

    if (user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        });
    }


    //jab bh isme se koi option mae click karega toh ye route trigger ho jayega
    function dashboard() {
        history.push("/admin/dashboard");
    }

    function orders() {
        history.push("/orders");
    }
    function account() {
        history.push("/account");
    }
    function cart() {
        history.push("/cart");
    }
    function logoutUser() {
        dispatch(logout());  //logout mae click karne se dispatch kar denge logout action

        alert.success("Logout Successfully");
        history.push("/"); //logout kia toh home page pe redirect ho jayega
    }

    return (
        <Fragment>
            {/* taki jab mouse useroptions mae hover kare tab baki chize halka shade ho jaye */}
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"  //name of the label
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "11" }} 
                open={open}
                direction="down" //options niche khule
                className="speedDial" //for css
                icon={
                    <img  //user ki image icon hoga useroptions ka
                        className="speedDialIcon"
                        src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                        alt="Profile"
                    />
                }
            >
                {options.map((item) => ( //hum yaha pe options array mae map fn use kar rahe h, 
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}  //agar click hua toh wo fn trigger ho jayega
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
        </Fragment>
    );
};

export default UserOptions;
