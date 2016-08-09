import request from 'superagent';
import { showDialog } from './dialog';

export const save = (stateToSave) => (dispatch) => {
	request
		.post('/api/project')
		.send(stateToSave)
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (err || !res.ok) {
				const data = {
					text: {
						header: 'Project - Export',
						body: 'Export unfortunately failed.'
					},
					buttons: [
						{
							value: 'OK',
							action: 'onConfirm'
						}
					]
				};

				dispatch(showDialog(data));
			} else {
				const data = {
					text: {
						header: 'Project - Export',
						body: 'Project was successfully exported.'
					},
					buttons: [
						{
							value: 'OK',
							action: 'onConfirm'
						}
					]
				};

				dispatch(showDialog(data));
			}
		});
};

export const load = (data) => (dispatch) => {
	dispatch({
		type: 'LOAD_PROJECT',
		data: data
	});
};

export const exportProject = (stateToExport) => (dispatch) => {
	request
		.post('/api/project/export')
		.send(stateToExport)
		.set('Accept', 'application/json')
		.end(function (err, res) {
			if (err || !res.ok) {
				const data = {
					text: {
						header: 'Project - Save',
						body: 'Project was unfortunately not saved.'
					},
					buttons: [
						{
							value: 'OK',
							action: 'onConfirm'
						}
					]
				};

				dispatch(showDialog(data));
			} else {
				const data = {
					text: {
						header: 'Project - Save',
						body: 'Project was succesfully saved.'
					},
					buttons: [
						{
							value: 'OK',
							action: 'onConfirm'
						}
					]
				};

				dispatch(showDialog(data));
			}
		});
};
