import request from 'superagent';
import { addClickarea } from './addclickarea';
import { showDialog } from './dialog';
import config from 'json!../../assets/json/dialogs.json';

export const createClickarea = (name) => (dispatch) => {
	dispatch(addClickarea({name}));
};

export const setOpacity = (opacity) => (dispatch) => {
	dispatch({
		type: 'SET_OPACITY',
		data: opacity
	});
};

export const createRect = (rect) => (dispatch) => {
	dispatch({
		type: 'CREATE_RECT',
		data: rect
	});
};

export const drawRect = () => (dispatch) => {
	dispatch({
		type: 'DRAW_RECT'
	});
};

export const makeClickarea = (clickarea, view, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'CREATE_CLICKAREA',
		data: {clickarea, view, nodes, edges}
	});
};

export const updateClickarea = (coords, index, view, nodes, edges, selected, bbox, scope) => (dispatch) => {
	dispatch({
		type: 'UPDATE_CLICKAREA',
		data: {coords, index, view, nodes, edges, selected, bbox, scope}
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

export const init = () => (dispatch) => {
	dispatch({
		type: 'INIT'
	});
};
