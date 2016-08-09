export const showDialog = (data) => (dispatch) => {
	dispatch({
		type: 'SHOW_DIALOG',
		data: data
	});
};

export const hideDialog = () => (dispatch) => {
	dispatch({
		type: 'HIDE_DIALOG'
	});
};
