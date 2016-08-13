import request from 'superagent';
import { showDialog } from './dialog';
import config from 'json!../../assets/json/dialogs.json';

export const removeArtboard = () => (dispatch) => {
	request
		.delete('/api/artboard')
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = config.dialogs.workspaceResetFail;
				//dispatch(showDialog(data));
			} else {
				const data = config.dialogs.workspaceReset;
				//dispatch(showDialog(data));
				//dispatch({ type: 'INIT' });
			}
		});
};

export const loadArtboard = (saveState, update) => (dispatch) => {
	request
		.get('/api/artboard')
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				console.log(err);
			} else {
				if (res.body.length > 0) {
					if (update === false) {
						dispatch({
							type: 'LOAD_PROJECT',
							data: res.body[0].clickareas
						});
					}
				}

				console.log('.....', update, res.body.length)

				if (update === true) {
					if (res.body.length > 0) {
						dispatch(updateArtboard(res.body[0], saveState));
					} else {
						dispatch(saveArtboard(saveState));
					}
				}
			}
		}
	);
};

export const updateArtboard = (res, state) => (dispatch) => {
	request
		.put('/api/artboard')
		.send({result: res, state: state})
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = config.dialogs.saveArtboardFailed;
				//dispatch(showDialog(data));
			} else {
				const data = config.dialogs.saveArtboardSuccess;
				//dispatch(showDialog(data));
			}
		});
};

export const saveArtboard = (state) => (dispatch) => {
	request
		.post('/api/artboard')
		.send(state)
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = config.dialogs.saveArtboardFailed;
				//dispatch(showDialog(data));
			} else {
				const data = config.dialogs.saveArtboardSuccess;
				//dispatch(showDialog(data));
				console.log('saved artboard', res);
			}
		});
};
