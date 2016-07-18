import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import clickareas from './clickarea';

export default combineReducers({
	routeReducer,
	clickareas
});
