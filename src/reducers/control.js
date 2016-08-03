import { handleActions } from 'redux-actions';
import update from 'react-addons-update';

export default handleActions({

	INIT_CONTROLS: (state, action) => {
		return update(state, {
			initialized: {$set: true}
		});
	},

	SELECT_TOOL: (state, action) => {
		return update(state, {
			tool: {$set: action.data}
		});
	}
}, {
	initialized: false,
	tool: 'pen',
	color: '#6ec2b3'
});
