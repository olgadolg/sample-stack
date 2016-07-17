import { handleActions } from 'redux-actions';

export default handleActions({

	ADD_CLICKAREA: (state, action) => {
		
		let list = {...state.list};
		list[(Object.keys(list).length).toString()] = {
			coords: null,
			goTo: action.payload.name
		}

		return {
			...state,
			list
		}
	},

	UPDATE_FILL: (state, action) => {
		return {
			...state,
			fill: action.data
		}
	}
}, {
	list: {},
	fill: false
});


