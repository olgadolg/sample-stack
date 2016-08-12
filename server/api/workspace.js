import Workspace from '../models/workspace';

const resetWorkspace = (request, reply) => {
	Workspace.remove({}, (error, item) => {
		if (error) return reply(error);

		return reply(item).code(200);
	});
};

const createWorkspace = (request, reply) => {
	const workspace = new Workspace();
	workspace.coords = request.payload;

	console.log('ehhh', workspace, request.payload)

	workspace.save((error, item) => {
		if (error) return reply(error);

		console.log('ohhh', item);

		return reply(item).code(200);
	});
};

const updateWorkspace = (request, reply) => {
	console.log(request.payload)
	const query = {'_id': request.payload.response._id};

	Workspace.findByIdAndUpdate(
		query, {$set: {coords: request.payload.workspace}},
		{new: true}, (error, item) => {
			console.log('error', error)
			if (error) return reply(error);

			return reply(item).code(200);
		});
};

const getWorkspace = (request, reply) => {
	Workspace.find({}, (err, items) => {
		if (err) return reply(err);

		return reply(items).code(200);
	});
};

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'POST',
			path: '/api/workspace',
			config: {
				handler: createWorkspace
			}
		},
		{
			method: 'PUT',
			path: '/api/workspace',
			config: {
				handler: updateWorkspace
			}
		},
		{
			method: 'GET',
			path: '/api/workspace',
			config: {
				handler: getWorkspace
			}
		},
		{
			method: 'DELETE',
			path: '/api/workspace',
			config: {
				handler: resetWorkspace
			}
		}
	]);

	next();
};

exports.register.attributes = {
	name: 'workspace'
};
