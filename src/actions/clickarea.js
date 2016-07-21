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

export const updateClickarea = (coords, index, view, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'UPDATE_CLICKAREA',
		data: {coords, index, view, nodes, edges}
	});
};

export const removeClickarea = (index, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'REMOVE_CLICKAREA',
		data: index
	});
};

export const updateFill = (bool) => (dispatch) => {
	dispatch({
		type: 'UPDATE_FILL',
		data: bool
	});
};
