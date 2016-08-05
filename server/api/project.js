import fs from 'fs';
import mkdirp from 'mkdirp';

const saveProject = (request, reply) => {
	var json = JSON.stringify(request.payload);

	fs.writeFile('./downloads/overlayer.json', json, function (err) {
		if (err) return reply().code(401);

		return reply().code(200);
	});

	return reply().code(200);
};

const exportProject = (request, reply) => {
	var json = JSON.stringify(request.payload, null, 2);
	var projectName = request.payload.clickareas.projectName;

	mkdirp('./projects/' + projectName + '/n5assets_' + projectName + '/views', function (err) {
		if (err) return reply().code(401);

		fs.writeFile('./projects/' + projectName + '/settings.json', json, function (err) {
			if (err) return reply().code(401);

			return reply().code(200);
		});
	});
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
		},
		{
			method: 'POST',
			path: '/api/project/export',
			config: {
				payload: {
					maxBytes: 209715200
				},
				handler: exportProject
			}
		}
	]);

	next();
};

exports.register.attributes = {
	name: 'project'
};
