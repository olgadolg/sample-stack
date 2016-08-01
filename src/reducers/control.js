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
	},
	SELECT_COLOR: (state, action) => {
		return {
			...state,
			color: action.data.hex
		};
	}
}, {
	initialized: false,
	tool: 'pen',
	color: '#6ec2b3'
});
