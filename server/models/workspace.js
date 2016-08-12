import mongoose, {Schema} from 'mongoose';

const workspaceSchema = Schema({
	coords: {
		type: Object
	}
});

export default mongoose.model('Workspace', workspaceSchema);
