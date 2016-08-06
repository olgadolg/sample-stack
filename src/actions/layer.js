import request from 'superagent';

export const addLayer = () => (dispatch) => {
	dispatch({
		type: 'ADD_LAYER'
	});
};
/*
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
*/

export const initLayer = (obj) => (dispatch) => {
	const req = request.post('/api/image');
	req.set('Accept', 'application/json');

	obj.files.forEach((file) => {

		console.log(file)

		req.attach('img_attach', file);
		req.field('filename', file.name);
		req.end(function (err, res) {
			if (err) {
				console.log(err)
				//alert('Something went wrong!');
			}

			if (res.status === 200) {
				dispatch({
					type: 'INIT_LAYER',
					data: {
						fileName: file.name.replace(/(.*)\.(.*?)$/, '$1'),
						image: obj.name,
						fileData: obj.fileData,
						currentView: obj.currentView
					}
				});
			}
		});
	});
};
