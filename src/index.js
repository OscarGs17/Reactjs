import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import reportWebVitals from './reportWebVitals';

// import { BrowserRouter } from 'react-router-dom'; 
import App from './pages/App'; 
import Provider from './context/Provider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter>  */}
      <Provider>
        <App />
      </Provider>
    {/* </BrowserRouter> */}
  </React.StrictMode>
);

reportWebVitals();
