import { handleActions } from 'redux-actions';

export default handleActions({

	INIT_CONTROLS: (state, action) => {
		return {
			...state,
			initialized: true
		};
	}
}, {
	initialized: false
});
