import fs from 'fs';
import path from 'path';
import config from 'config';
import Image from '../models/image';

const addImage = (request, reply) => {
	const dir = path.join(__dirname, '..', '..', 'src', config.get('image_dir'));
	fs.writeFile(dir + request.payload.filename, request.payload.img_attach._data, function(error){
		if (error) return reply(error);
		return reply().code(200);
	});
};

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'POST',
			path: '/api/image',
			config: {
				payload:{
					maxBytes: 209715200,
					output:'stream',
					parse: true
				},
				handler: addImage
			}
		}
	])

	next()
}

exports.register.attributes = {
	name: 'image'
}
