import axios from 'axios';
import { addImage } from './addimage'

export const uploadImage = (image) => (dispatch) => {

	console.log('in action', image[0])

	const config = { headers: { 'Content-Type': 'multipart/form-data' } };

	return axios.post('/api/image', image, config)
		.then(({ data }) => {
			console.log('recieved data callack', data)
			dispatch(addImage(data));
		});
}
