import Image from '../models/image'

const addImage = (request, reply) => {
	console.log(request);
}

exports.register = (server, options, next) => {
	server.route([
		{
			method: 'POST',
			path: '/api/image',
			config: {
				handler: addImage
			}
		}
	])

	next()
}

exports.register.attributes = {
	name: 'image'
}
