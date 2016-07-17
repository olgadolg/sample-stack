import { addClickarea } from './addclickarea'

export const createClickarea = () => (dispatch) => {
	return dispatch(addClickarea());
};

export const updateFill = (bool) => (dispatch) => {
	dispatch({
		type: 'UPDATE_FILL',
		data: bool
	});

}
