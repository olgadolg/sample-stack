import request from 'superagent';
import { addClickarea } from './addclickarea';
import { showDialog } from './dialog';
import config from 'json!../../assets/json/dialogs.json';

export const createClickarea = (name) => (dispatch) => {
	dispatch(addClickarea({name}));
};

export const makeClickarea = (clickarea, view, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'CREATE_CLICKAREA',
		data: {clickarea, view, nodes, edges}
	});
};

export const updateClickarea = (coords, index, view, nodes, edges, selected, bbox) => (dispatch) => {
	dispatch({
		type: 'UPDATE_CLICKAREA',
		data: {coords, index, view, nodes, edges, selected, bbox}
	});
};

export const unselectClickarea = () => (dispatch) => {
	dispatch({
		type: 'UNSELECT_CLICKAREA'
	});
};

export const removeClickarea = (index, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'REMOVE_CLICKAREA',
		data: index
	});
};

export const titleClickarea = (value) => (dispatch) => {
	dispatch({
		type: 'TITLE_CLICKAREA',
		data: value
	});
};

export const updateFill = (bool) => (dispatch) => {
	dispatch({
		type: 'UPDATE_FILL',
		data: bool
	});
};

export const removeColor = (bool) => (dispatch) => {
	dispatch({
		type: 'REMOVE_COLOR',
		data: bool
	});
};

export const getCopy = (copy) => (dispatch) => {
	dispatch({
		type: 'GET_COPY'
	});
};

export const saveCopy = (copy) => (dispatch) => {
	dispatch({
		type: 'SAVE_COPY',
		data: copy
	});
};

export const cutClickarea = () => (dispatch) => {
	dispatch({
		type: 'CUT_CLICKAREA'
	});
};

export const saveCut = (nodes, edges) => (dispatch) => {
	dispatch({
		type: 'SAVE_CUT',
		data: {
			nodes: nodes,
			edges: edges
		}
	});
};

export const pasteCut = () => (dispatch) => {
	dispatch({
		type: 'PASTE_CUT'
	});
};

export const pasteClickarea = () => (dispatch) => {
	dispatch({
		type: 'PASTE_CLICKAREA'
	});
};

export const saveWorkspace = (workspace) => (dispatch) => {
	dispatch({
		type: 'SAVE_WORKSPACE',
		data: {
			workspace: workspace,
			load: false
		}
	});
};

export const init = () => (dispatch) => {
	dispatch({
		type: 'INIT'
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
				//console.log('delete err', err);
			} else {
				//console.log('deleted', res);
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
			} else {
				const data = config.dialogs.saveWorkspace;
				//dispatch(showDialog(data));
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
			} else {
				const data = config.dialogs.saveWorkspace;
				//dispatch(showDialog(data));
			}
		});
};
