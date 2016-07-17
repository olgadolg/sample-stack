import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import { syncHistory } from 'redux-simple-router';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';
import store from './store';
import App from './components/App';
import Main from './containers/Main';


render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRedirect to='/overlayer'/>
				<Route path="/overlayer" component={ Main }/>
			</Route>
		</Router>
	</Provider>
), document.getElementById('root'))
