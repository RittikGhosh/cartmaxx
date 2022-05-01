import React from 'react'
import { ReactNavbar } from "overlay-navbar"
import logo from "../../../images/logo.png";
import { BiSearch, BiCart, BiLogIn } from "react-icons/bi"

const options = {
    burgerColor: "grey",
    burgerColorHover: "#e0a8a4",
    logo,
    logoWidth: "20vmax",
    navColor1: "white",
    logoHoverSize: "10px",
    logoHoverColor: "#eb4034",
    link1Text: "Home",
    link2Text: "Products",
    link3Text: "Contact",
    link4Text: "About",
    link1Url: "/",
    link2Url: "/products",
    link3Url: "/contact",
    link4Url: "/about",
    link1Size: "1.3vmax",
    link1Color: "rgba(35, 35, 35,0.8)",
    nav1justifyContent: "flex-end",
    nav2justifyContent: "flex-end",
    nav3justifyContent: "flex-start",
    nav4justifyContent: "flex-start",
    link1ColorHover: "#e0a8a4",
    link1Margin: "1vmax",
    profileIconColor: "rgba(35, 35, 35,0.8)",
    profileIcon: `${true}`,
    ProfileIconElement: BiLogIn,
    profileIconColorHover: "#eb4034",
    profileIconUrl:"/login",
    searchIconColor: "rgba(35, 35, 35,0.8)",
    searchIcon: `${true}`,
    SearchIconElement: BiSearch,
    searchIconColorHover: "#eb4034",
    cartIconColor: "rgba(35, 35, 35,0.8)",
    cartIcon: `${true}`,
    CartIconElement: BiCart,
    cartIconColorHover: "#rgba(35, 35, 35,0.8)",
};
const Header = () => {
    return <ReactNavbar {...options} />
}

export default Header;
