import { addClickarea } from './addclickarea'

export const createClickarea = () => (dispatch) => {

	return dispatch({
		type: 'ADD_CLICKAREA',
		data: 'foo'
	});
};

export const updateFill = (bool) => (dispatch) => {
	dispatch({
		type: 'UPDATE_FILL',
		data: bool
	});

}
