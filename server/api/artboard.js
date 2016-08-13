import Artboard from '../models/workspace';

const saveArtboard = (request, reply) => {
	const artboard = new Artboard();
	artboard.clickareas = request.payload;

	artboard.save((error, item) => {
		if (error) return reply(error);
		console.log('saved', item);

		return reply(item).code(200);
	});

	return reply(request.payload).code(200);
};

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'POST',
			path: '/api/artboard',
			config: {
				handler: saveArtboard
			}
		}
	]);

	next();
};

exports.register.attributes = {
	name: 'artboard'
};
