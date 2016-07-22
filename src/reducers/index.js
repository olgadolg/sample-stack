import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import clickareas from './clickarea';
import controls from './control';

export default combineReducers({
	routeReducer,
	clickareas,
	controls
});
