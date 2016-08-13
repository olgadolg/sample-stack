import mongoose, {Schema} from 'mongoose';

const artboardSchema = Schema({
	clickareas: {
		type: Object
	}
});

export default mongoose.model('Artboard', artboardSchema);
