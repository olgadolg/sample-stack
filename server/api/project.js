import fs from 'fs';

const saveProject = (request, reply) => {
	var json = JSON.stringify(request.payload);

	fs.writeFile('./downloads/overlayer.json', json, function (err) {
		if (err) return reply().code(401);

		return reply().code(200);
	});

	return reply().code(200);
};

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'POST',
			path: '/api/project',
			config: {
				payload: {
					maxBytes: 209715200
				},
				handler: saveProject
			}
		}
	]);

	next();
};

exports.register.attributes = {
	name: 'project'
};
