import { addClickarea } from './addclickarea'

export const createClickarea = (name) => (dispatch) => {
	dispatch(addClickarea({name}));
};

export const updateFill = (bool) => (dispatch) => {
	dispatch({
		type: 'UPDATE_FILL',
		data: bool
	});

}

export const updateCoords = (coords, index) => (dispatch) => {

	console.log(coords, index)
	
	dispatch({
		type: 'UPDATE_COORDS',
		data: {coords, index}
	});

}
