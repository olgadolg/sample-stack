import request from 'superagent';
import { showDialog } from './dialog';
import config from 'json!../../assets/json/dialogs.json';

export const save = (stateToSave) => (dispatch) => {
	request
		.post('/api/project')
		.send(stateToSave)
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = config.dialogs.saveFailed;
				dispatch(showDialog(data));
			} else {
				const data = config.dialogs.saveSuccess;
				dispatch(showDialog(data));
			}
		});
};

export const load = (data) => (dispatch) => {
	dispatch({
		type: 'LOAD_PROJECT',
		data: data
	});
};

export const exportProject = (stateToExport) => (dispatch) => {
	request
		.post('/api/project/export')
		.send(stateToExport)
		.set('Accept', 'application/json')
		.end(function (err, res) {
			if (err || !res.ok) {
				const data = config.dialogs.exportFailed;
				dispatch(showDialog(data));
			} else {
				const data = config.dialogs.exportSuccess;
				dispatch(showDialog(data));
			}
		});
};
