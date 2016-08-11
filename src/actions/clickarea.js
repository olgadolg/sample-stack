import request from 'superagent';
import { addClickarea } from './addclickarea';

export const createClickarea = (name) => (dispatch) => {
	dispatch(addClickarea({name}));
};

export const makeClickarea = (clickarea, view, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'CREATE_CLICKAREA',
		data: {clickarea, view, nodes, edges}
	});
};

export const updateClickarea = (coords, index, view, nodes, edges, selected) => (dispatch) => {
	dispatch({
		type: 'UPDATE_CLICKAREA',
		data: {coords, index, view, nodes, edges, selected}
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
		data: workspace
	});
};
