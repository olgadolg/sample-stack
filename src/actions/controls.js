export const initControls = (view, nodes, edges) => (dispatch) => {
	dispatch({
		type: 'INIT_CONTROLS'
	});
};

export const selectTool = (tool) => (dispatch) => {
	dispatch({
		type: 'SELECT_TOOL',
		data: tool
	});
};
