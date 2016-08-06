import fs from 'fs';
import path from 'path';
import config from 'config';

const addImage = (request, reply) => {

	console.log(request.payload)

	/*
	const dir = path.join(__dirname, '..', '..', 'src', '/assets/images');
	fs.writeFile(dir + request.payload.filename, request.payload.img_attach._data, function (error) {
		if (error) return reply(error);
		console.log(error)

		return reply().code(200);
	});
	*/

	return reply().code(200);
};

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'POST',
			path: '/api/image',
			config: {
				payload: {
					maxBytes: 209715200,
					output: 'stream',
					parse: true
				},
				handler: addImage
			}
		}
	]);

	next();
};

exports.register.attributes = {
	name: 'image'
};
