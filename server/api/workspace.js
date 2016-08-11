import fs from 'fs';
import mkdirp from 'mkdirp';
import config from 'config';

const saveWorkspace = (request, reply) => {
	var json = JSON.stringify(request.payload);

};

const getWorkspace = (request, reply) => {

};

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'POST',
			path: '/api/workspace',
			config: {
				handler: saveWorkspace
			}
		},
		{
			method: 'GET',
			path: '/api/workspace',
			config: {
				handler: getWorkspace
			}
		}
	]);

	next();
};

exports.register.attributes = {
	name: 'workspace'
};
