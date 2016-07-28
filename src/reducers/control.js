import { handleActions } from 'redux-actions';

export default handleActions({

	INIT_CONTROLS: (state, action) => {
		return {
			...state,
			initialized: true
		};
	},

	SELECT_TOOL: (state, action) => {
		return {
			...state,
			tool: action.data
		};
	}
}, {
	initialized: false,
	tool: 'selectAll'
});
