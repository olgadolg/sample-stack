import { addClickarea } from './addclickarea'

export const createClickarea = (name) => (dispatch) => {
	dispatch(addClickarea({name}));
};

export const updateClickarea = (coords, index) => (dispatch) => {	
	dispatch({
		type: 'UPDATE_CLICKAREA',
		data: {coords, index}
	});
}

export const removeClickarea = (index) => (dispatch) => {	
	dispatch({
		type: 'REMOVE_CLICKAREA',
		data: index
	});
}

export const updateFill = (bool) => (dispatch) => {
	dispatch({
		type: 'UPDATE_FILL',
		data: bool
	});
}
