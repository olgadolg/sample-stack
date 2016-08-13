import request from 'superagent';
import { showDialog } from './dialog';
import config from 'json!../../assets/json/dialogs.json';

export const saveArtboard = (state) => (dispatch) => {
	request
		.post('/api/artboard')
		.send(state.clickareas)
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = config.dialogs.saveArtboardFailed;
				dispatch(showDialog(data));
			} else {
				const data = config.dialogs.saveArtboardSuccess;
				dispatch(showDialog(data));
			}
		});
};
