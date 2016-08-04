export const updateView = (view, nodes, edges) => (dispatch) => {
	console.log('view', view);
	dispatch({
		type: 'UPDATE_VIEW',
		data: {view, nodes, edges}
	});
};
