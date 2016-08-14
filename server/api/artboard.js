import Artboard from '../models/artboard';

const deleteArtboard = (request, reply) => {
	Artboard.remove({}, (error, item) => {
		if (error) return reply(error);

		console.log('deleted', item);

		return reply(item).code(200);
	});
};

const getArtboard = (request, reply) => {
	Artboard.find({}, (err, items) => {
		if (err) return reply(err);

		return reply(items).code(200);
	});
};

const updateArtboard = (request, reply) => {
	const query = {'_id': request.payload.result._id};

	Artboard.findByIdAndUpdate(
		query, {$set: {clickareas: JSON.stringify(request.payload.state)}},
		{new: true}, (error, item) => {
			if (error) return reply(error);

			return reply(item).code(200);
		});
};

const saveArtboard = (request, reply) => {
	const artboard = new Artboard({name: 'artboard'}, { minimize: false });
	artboard.clickareas = JSON.stringify(request.payload);

	artboard.save((error, item) => {
		conosole.log('erroor', error);
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
				payload: {
					maxBytes: 209715200
				},
				handler: saveArtboard
			}
		},
		{
			method: 'PUT',
			path: '/api/artboard',
			config: {
				payload: {
					maxBytes: 209715200
				},
				handler: updateArtboard
			}
		},
		{
			method: 'GET',
			path: '/api/artboard',
			config: {
				handler: getArtboard
			}
		},
		{
			method: 'DELETE',
			path: '/api/artboard',
			config: {
				handler: deleteArtboard
			}
		}
	]);

	next();
};

exports.register.attributes = {
	name: 'artboard'
};
