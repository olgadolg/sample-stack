import $ from 'jquery';
import request from 'superagent';
import { addImage } from './addimage'

export const uploadImage = (files) => (dispatch) => {

	const req = request.post('/api/image');

	req.set('Accept', 'application/json');

	files.forEach((file) => {
		req.attach('img_attach', file);
		req.field('filename', file.name);
		req.end(function(err, res) {
			if (res.status === 200) {

				const 
					fileArray = file.name.split("."),
					extension = fileArray[(fileArray.length)-1];

				console.log(extension);

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
};
