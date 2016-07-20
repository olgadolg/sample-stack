import { handleActions } from 'redux-actions';

export default handleActions({

	ADD_CLICKAREA: (state, action) => {

		let 
			clickarea = {...state.clickarea},
			isNew = [...state.isNew];


		clickarea.goTo = action.payload.name;
		isNew = true;

		return {
			...state,
			clickarea,
			isNew
		}
	},

	CREATE_CLICKAREA: (state, action) => {

		let 
			views = {...state.views},
			isNew = [...state.isNew];

		views[action.data.view]['clickareas'][Object.keys(views[action.data.view].clickareas).length] = action.data.clickarea;
		isNew = false;

		return {
			...state,
			views,
			isNew
		}
	},

	UPDATE_CLICKAREA: (state, action) => {
		let 
			views = {...state.views},
			isNew = [...state.isNew];

		isNew = false;

		views[action.data.view].clickareas[action.data.index].coords = action.data.coords;

		return {
			...state,
			views,
			isNew
		}
	},
	
	REMOVE_CLICKAREA: (state, action) => {
		let 
			views = {...state.views},
			isNew = [...state.isNew];
		
		isNew = false;

		delete views[action.data];

		return {
			...state,
			views,
			isNew
		}
	},
	
	UPDATE_FILL: (state, action) => {
		let isNew = [...state.isNew];

		isNew = false;

		return {
			...state,
			fill: action.data,
			isNew
		}
	},

	ADD_VIEW: (state, action) => {
		let 
			views = {...state.views},
			isNew = [...state.isNew];

		isNew = false;

		views[action.data.fileName] = {
			viewId: action.data.fileName,
			image: action.data.image,
			clickareas: {}
		}

		return {
			...state,
			views,
			isNew
		}
	}
}, {
	views: {},
	clickarea: {
		coords: null,
		goTo: null
	},
	fill: false,
	isNew: false
});


