export const updateView = (view) => (dispatch) => {

	console.log('in action')

	dispatch({
		type: 'UPDATE_VIEW',
		data: view
	});
};
