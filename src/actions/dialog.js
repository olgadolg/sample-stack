export const showDialog = (body, accept, cancel) => (dispatch) => {
	dispatch({
		type: 'SHOW_DIALOG',
		data: {
			body: body,
			accept: accept,
			cancel: cancel
		}
	});
};

export const hideDialog = () => (dispatch) => {
	dispatch({
		type: 'HIDE_DIALOG'
	});
};
