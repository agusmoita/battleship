import React from 'react';
import { render } from 'react-dom';
//import { Provider } from 'react-redux';
//import { createStore } from 'redux';
//import reducer from './reducers';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom'

//const store = createStore(reducer);
//<Provider store={store} >
//</Provider> 

render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);
registerServiceWorker();
