import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/reset.css';
import { notification, message } from 'antd';

console.log('ABOBA');
const root = ReactDOM.createRoot(document.getElementById('root'));
notification.config({
    getContainer: () => document.getElementById('root'),
    placement: "topRight",
    duration: 4
});

message.config({
    getContainer: () => document.getElementById('root'),
    duration: 3
});
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
