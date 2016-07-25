import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import store from './store';
import App from './components/App';
import Container from './components/App/Container';

render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRedirect to="/overlayer"/>
				<Route path="/overlayer" component={Container}/>
			</Route>
		</Router>
	</Provider>
), document.getElementById('root'));
