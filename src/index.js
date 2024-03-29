import React from 'react';
import ReactDOM from 'react-dom';
// import { render } from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
