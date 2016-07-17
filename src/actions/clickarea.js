import { addClickarea } from './addclickarea'

export const createClickarea = (name) => (dispatch) => {
	return dispatch(addClickarea({name}));
};

export const updateFill = (bool) => (dispatch) => {
	dispatch({
		type: 'UPDATE_FILL',
		data: bool
	});

}
