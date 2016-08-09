export const updateView = (view, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'UPDATE_VIEW',
		data: {view, nodes, edges}
	});
};

export const removeView = (view) => (dispatch) => {
	dispatch({
		type: 'REMOVE_VIEW',
		data: view
	});
};

export const resetRemoveView = () => (dispatch) => {
	dispatch({
		type: 'RESET_REMOVE_VIEW'
	});
};
