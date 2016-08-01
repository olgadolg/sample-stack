import request from 'superagent';

export const addLayer = () => (dispatch) => {
	dispatch({
		type: 'ADD_LAYER'
	});
};

export const initLayer = (obj) => (dispatch) => {
	dispatch({
		type: 'INIT_LAYER',
		data: {
			fileName: obj.name.replace(/(.*)\.(.*?)$/, '$1'),
			image: obj.name,
			fileData: obj.fileData,
			currentView: obj.currentView
		}
	});
};
