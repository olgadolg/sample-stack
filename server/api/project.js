import fs from 'fs';
import mkdirp from 'mkdirp';
import config from 'config';

const saveProject = (request, reply) => {
	var json = JSON.stringify(request.payload);

	fs.writeFile('./downloads/overlayer.json', json, function (err) {
		if (err) return reply().code(401);

		return reply().code(200);
	});

	return reply().code(200);
};

const exportProject = (request, reply) => {
	var stateObj = request.payload;
	var projectName = request.payload.clickareas.projectName;
	var apts = {};
	var views = {};

	for (var view in stateObj.clickareas.views) {
		// cleanup
		for (var item in stateObj.clickareas.views[view].clickareas) {
			delete stateObj.clickareas.views[view].clickareas[item].color;
			delete stateObj.clickareas.views[view].clickareas[item].fill;
		}

		views[view] = {
			viewId: stateObj.clickareas.views[view].viewId,
			clickarea: stateObj.clickareas.views[view].clickareas
		};

		for (var clickarea in stateObj.clickareas.views[view].clickareas) {
			apts[stateObj.clickareas.views[view].clickareas[clickarea].goTo] = {
				typeAptId: '0',
				viewId: '0',
				floor: '0',
				rooms: '0',
				size: '0',
				price: '0',
				fee: '0',
				available: ''
			};
		}
	}

	mkdirp(config.get('project_dir') + projectName + '/n5assets_' + projectName + '/views', function (err) {
		if (err) return reply().code(401);

		for (var view in stateObj.clickareas.views) {
			fs.createReadStream('./assets/images/' + stateObj.clickareas.views[view].image).pipe(fs.createWriteStream('./projects/' + projectName + '/n5assets_' + projectName + '/views/' + stateObj.clickareas.views[view].image));
		}

		fs.writeFile('./projects/' + projectName + '/intApt.json', JSON.stringify(apts, null, 4), function (err) {
			if (err) return reply().code(401);
			return reply().code(200);
		});

		fs.writeFile('./projects/' + projectName + '/settings.json', JSON.stringify(views, null, 4), function (err) {
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
