export const updateView = (view, nodes, edges) => (dispatch) => {

	console.log('in action', nodes, edges)

	dispatch({
		type: 'UPDATE_VIEW',
		data: {view, nodes, edges}
	});
};

export const selectViewUpdate = (view, nodes, edges) => (dispatch) => {

	console.log("view", view, "nodes", nodes, "edges", edges);

	dispatch({
		type: 'SELECT_UPDATE_VIEW',
		data: {view, nodes, edges}
	});
};
