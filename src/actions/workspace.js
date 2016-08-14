import request from 'superagent';
import { showDialog } from './dialog';
import config from 'json!../../assets/json/dialogs.json';

export const saveWorkspace = (workspace) => (dispatch) => {
	dispatch({
		type: 'SAVE_WORKSPACE',
		data: {
			workspace: workspace,
			load: false
		}
	});
};

export const loadWorkspace = (workspace, update, onload) => (dispatch) => {
	request
		.get('/api/workspace')
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
			} else {
				if (res.body.length > 0) {
					var load = ('workspace' in res.body[0].coords);

					dispatch({
						type: 'SAVE_WORKSPACE',
						data: {
							workspace: res.body[0].coords,
							load: load,
							onload: onload
						}
					});
				} else {
					dispatch({ type: 'INIT' });
				}

				if (update === true) {
					if (res.body.length > 0) {
						if (workspace === null) return;
						dispatch(updateWorkspace(res.body[0], workspace));
					} else {
						if (workspace === null) return;
						dispatch(storeWorkspace(workspace));
					}
				}
			}
		});
};

export const removeWorkspace = () => (dispatch) => {
	request
		.delete('/api/workspace')
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = config.dialogs.workspaceResetFail;
				dispatch(showDialog(data));
			} else {
				const data = config.dialogs.workspaceReset;
				dispatch(showDialog(data));
				dispatch({ type: 'INIT' });
			}
		});
};

export const storeWorkspace = (workspace) => (dispatch) => {
	request
		.post('/api/workspace')
		.send(workspace)
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = config.dialogs.saveWorkspaceFail;
				dispatch(showDialog(data));
			} else {
				const data = config.dialogs.saveWorkspace;
				dispatch(showDialog(data));
				dispatch({ type: 'RESET_INIT' });
			}
		});
};

export const updateWorkspace = (response, workspace) => (dispatch) => {
	request
		.put('/api/workspace')
		.send({response: response, workspace: workspace})
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = config.dialogs.saveWorkspaceFail;
				dispatch(showDialog(data));
			} else {
				const data = config.dialogs.saveWorkspace;
				dispatch(showDialog(data));
				dispatch({ type: 'RESET_INIT' });
			}
		});
};
