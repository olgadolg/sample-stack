import { handleActions } from 'redux-actions';
import update from 'react-addons-update';

export default handleActions({

	SHOW_DIALOG: (state, action) => {
		return update(state, {
			show: {$set: true},
			content: {$set: action.data}
		});
	},

	HIDE_DIALOG: (state, action) => {

	}
}, {
	content: {},
	show: false
});
