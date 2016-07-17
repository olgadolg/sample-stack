import { handleActions } from 'redux-actions';

export default handleActions({

	ADD_CLICKAREA: (state, action) => {

		let newState = Object.assign({}, state)
		newState.list++;

		return newState;
	},

	UPDATE_FILL: (state, action) => {

		return {
			...state,
			fill: action.data
		}
	}
}, {
	list: 0,
	fill: false
});


