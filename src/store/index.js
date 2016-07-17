import { createStore, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { syncHistory } from 'redux-simple-router';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from '../reducers';

const reduxRouterMiddleware = syncHistory(browserHistory);
const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware, thunkMiddleware, logger)(createStore);

export default createStoreWithMiddleware(reducers);