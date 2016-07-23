import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import store from './store';
import App from './components/App';
import Main from './components/Main';

render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRedirect to='/overlayer'/>
				<Route path="/overlayer" component={Main}/>
			</Route>
		</Router>
	</Provider>
), document.getElementById('root'))
