import { addClickarea } from './addclickarea';

export const createClickarea = (name) => (dispatch) => {
	dispatch(addClickarea({name}));
};

export const makeClickarea = (clickarea, view) => (dispatch) => {
	dispatch({
		type: 'CREATE_CLICKAREA',
		data: {clickarea, view}
	});
};

export const updateClickarea = (coords, index, view) => (dispatch) => {
	dispatch({
		type: 'UPDATE_CLICKAREA',
		data: {coords, index, view}
	});
};

export const removeClickarea = (index) => (dispatch) => {
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
