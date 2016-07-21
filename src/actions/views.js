export const updateView = (view, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'UPDATE_VIEW',
		data: {view, nodes, edges}
	});
};

export const selectViewUpdate = (view, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'SELECT_UPDATE_VIEW',
		data: {view, nodes, edges}
	});
};
