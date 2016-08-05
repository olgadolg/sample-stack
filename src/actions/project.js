import request from 'superagent';

export const save = (stateToSave) => (dispatch) => {
	request
		.post('/api/project')
		.send(stateToSave)
		.set('Accept', 'application/json')
		.end(function (err, res) {
			if (err || !res.ok) {
				alert('Oh no! error');
			} else {
				alert('yay got ' + JSON.stringify(res.body));
			}
		});
};

export const load = (data) => (dispatch) => {
	dispatch({
		type: 'LOAD_PROJECT',
		data: data
	});
};
