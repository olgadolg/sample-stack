import request from 'superagent';

export const addLayer = () => (dispatch) => {
	dispatch({
		type: 'ADD_LAYER'
	});
};

export const initLayer = (obj) => (dispatch) => {
	const req = request.post('/api/image');
	req.set('Accept', 'application/json');

	obj.files.forEach((file) => {
		req.attach('img_attach', file);
		req.field('filename', file.name);
		req.end(function (err, res) {
			if (err) {
				console.log(err)
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
