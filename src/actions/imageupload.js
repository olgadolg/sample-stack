import request from 'superagent';

export const uploadImage = (obj) => (dispatch) => {
	dispatch({
		type: 'ADD_VIEW',
		data: {
			fileName: obj.name.replace(/(.*)\.(.*?)$/, '$1'),
			image: obj.name,
			fileData: obj.fileData
		}
	});
	/*
	const req = request.post('/api/image');

	req.set('Accept', 'application/json');

	files.forEach((file) => {
		req.attach('img_attach', file);
		req.field('filename', file.name);
		req.end(function (err, res) {
			if (err) {
				alert('Something went wrong!');
			}

			if (res.status === 200) {
				dispatch({
					type: 'ADD_VIEW',
					data: {
						fileName: file.name.replace(/(.*)\.(.*?)$/, '$1'),
						image: file.name
					}
				});
			}
		});
	});
	*/
};
