import React, { Fragment, useRef, useState, useEffect } from "react";
import "./LoginSignUp.css";
import Loader from "../layout/Loader/Loader";
//used for forget password,
import { Link } from "react-router-dom";
//icon used in email input on left side
import MailOutlineIcon from "@material-ui/icons/MailOutline";
//icon used in password input on left side
import LockOpenIcon from "@material-ui/icons/LockOpen";
//icon used in profile pic in register
import FaceIcon from "@material-ui/icons/Face";
//to get data from database and store
import { useDispatch, useSelector } from "react-redux";
//to trigger login action 
import { clearErrors, login ,register} from "../../actions/userAction";
//for alerts
import { useAlert } from "react-alert";
//jab login ho jayega we will trigger another route,i.e it will attach account in url
import { useHistory,useLocation } from "react-router-dom";

const LoginSignUp = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();
  const location = useLocation();

  //to get user data from store
  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  // useRef can be used to access a DOM element directly.we give ref={variable name} in html elements
  //it targets the login form,hum log login form mae ref={loginTab} dia a 
  const loginTab = useRef(null);
  //it targets the register form
  const registerTab = useRef(null);
  //used to switch color when u click on login or register
  const switcherTab = useRef(null);


  //jo bh type karenge email mae wo is state value mae a jayega
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  //make a state value whose initial value is a obj
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  //destructuring the state variable user
  const { name, email, password } = user;

  //state value for image
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  //whenever u click login below form,this fn will dispatch login action
  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };
  //when u click in register below form this fn will run
  const registerSubmit = (e) => {
    //first we prevent default i.e it will load same page
    e.preventDefault();
    //form ka data banake bhejenge
    const myForm = new FormData();

    //form mae name tag mae name(state value which is jo tum name doge)
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };

  //fn when u type name,email,password and when u upload image for profile pic
  const registerDataChange = (e) => {
    //e.target.name input tag ka name h,for photo do something
    if (e.target.name === "avatar") {
      //file read karne k lia
      const reader = new FileReader();

      //load k time change setAvatar and setAvatarPreview
      reader.onload = () => {
        if (reader.readyState === 2) {  //jab loading khatam ho jayega ,0-initial state,1-processing,2-done
          //change setAvatar and setAvatarPreview
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      //read kar lena
      reader.readAsDataURL(e.target.files[0]);
    } else {// and for others(name,email,password) do something else 
      //change setUser,uska andar name,email,password change karo
      setUser({ ...user, [e.target.name]: e.target.value }); //e.target.name is the name of input and   e.target.value is the value/jo type karega in input 
    }
  };

//agar logged in h toh shipping wala else /account wala, here we are spilting ?redirect=shipping from = and in 1 index we have shipping
// location.search is ?redirect=shipping
  const redirect = location.search ? location.search.split("=")[1] : "/account"; 

  useEffect(() => {
    //if there is any error(like wrong password etc) it will show alert
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    //if isAuthenticated is true(i.e we get the user) then go to /account route ,then u wont be able to access login/signup page
    if (isAuthenticated) {
      history.push(redirect);
    }

  }, [dispatch, error, alert, , redirect, isAuthenticated]);

  //we pass an event obj e, and tab is login or register
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      //using switcherTab we target the  button and add shiftToNeutral(it shifts the color to left i.e login ) class  and remove shiftToRight class (which removes color from register)
      //these shiftToNeutral,shift... classes are used in css to give color and remove color
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm"); //register form ko hata deta h
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight"); //register k niche color a jayega
      switcherTab.current.classList.remove("shiftToNeutral");//login k niche se color chala jayega

      registerTab.current.classList.add("shiftToNeutralForm"); //register form ko la deta h
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  {/* to toggle between login and register */}
                  {/* when u click on LOGIN ,switchTabs fn will be called there we will change it to login */}
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  {/* when u click on REGISTER ,switchTabs fn will be called there we will change it to register */}
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                {/* dont know */}
                <button ref={switcherTab}></button>
              </div>
              {/* when u click on login button below the form, loginSubmit fn will envoke */}
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  {/* the icon */}
                  <MailOutlineIcon />
                  {/* jaha pe email type karenge */}
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail} //state value
                    onChange={(e) => setLoginEmail(e.target.value)} //changing state value as u type anything
                  />
                </div>
                <div className="loginPassword">
                  {/* the icon */}
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}//changing state value as u type anything
                  />
                </div>
                {/* when u click on froget password then  this /password/forgot route will be triggered */}
                <Link to="/password/forgot">Forget Password ?</Link>
                {/* login button below the form */}
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              {/* almost same as login form */}
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data" //it means we will not only pass string but also image
                onSubmit={registerSubmit} //when u click on register button below register form, registerSubmit fn will envoke
              >

                {/* same thing as login */}
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange} // registerDataChange fn will envoke when name is changed, we use this fn in every case
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  {/* upload image for profile */}
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file" //to upload file
                    name="avatar"
                    accept="image/*" //will accept image of all types
                    onChange={registerDataChange} //when u upload an image registerDataChange fn will envoke
                  />
                </div>
                {/* register button below */}
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </>
  )
}


export default LoginSignUp;