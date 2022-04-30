import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//to make the store
import { Provider } from "react-redux";
import store from './store';


//to show alerts when error in website ,we wrap app component in AlertProvider 
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

//where the error will occur and for how many seconds we will show that
const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};
ReactDOM.render(
  //we wrap our app in Provider and pass the store to set up the store
  <Provider store={store}>
    <AlertProvider template={AlertTemplate} {...options}> 
      <App />
    </AlertProvider>,
  </Provider>,
  document.getElementById("root")

);
