import { handleActions } from 'redux-actions';

export default handleActions({

	ADD_CLICKAREA: (state, action) => {
		
		let views = {...state.views};
		views[(Object.keys(views).length).toString()] = {
			coords: null,
			goTo: action.payload.name
		}

		return {
			...state,
			views
		}
	},

	UPDATE_CLICKAREA: (state, action) => {
		let views = {...state.views};
		views[action.data.index].coords = action.data.coords;

		return {
			...state,
			views
		}
	},
	
	REMOVE_CLICKAREA: (state, action) => {
		let views = {...state.views};
		delete views[action.data];

		return {
			...state,
			views
		}
	},
	
	UPDATE_FILL: (state, action) => {
		return {
			...state,
			fill: action.data
		}
	}
}, {
	views: {},
	fill: false
});


