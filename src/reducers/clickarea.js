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
		};
	},

	CREATE_CLICKAREA: (state, action) => {
		let
			views = {...state.views},
			isNew = [...state.isNew];

		let currentView = [...state.currentView.replace(/(.*)\.(.*?)$/, '$1')];
		currentView = currentView.join('.').replace(/\./g, '');

		views[currentView]['clickareas'][Object.keys(views[currentView].clickareas).length] = action.data.clickarea;
		isNew = false;

		return {
			...state,
			views,
			isNew
		};
	},

	UPDATE_CLICKAREA: (state, action) => {
		let
			views = {...state.views},
			isNew = [...state.isNew];

		let currentView = [...state.currentView.replace(/(.*)\.(.*?)$/, '$1')];
		currentView = currentView.join('.').replace(/\./g, '');

		isNew = false;

		views[currentView].clickareas[action.data.index].coords = action.data.coords;

		return {
			...state,
			views,
			isNew
		};
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
		};
	},

	UPDATE_FILL: (state, action) => {
		let isNew = [...state.isNew];

		isNew = false;

		return {
			...state,
			fill: action.data,
			isNew
		};
	},

	ADD_VIEW: (state, action) => {
		let
			views = {...state.views},
			currentView = [...state.currentView],
			isNew = [...state.isNew];

		isNew = false;
		currentView = action.data.image;

		views[action.data.fileName] = {
			viewId: action.data.fileName,
			image: action.data.image,
			clickareas: {}
		};

		return {
			...state,
			views,
			isNew,
			currentView
		};
	},

	UPDATE_VIEW: (state, action) => {
		let currentView = [...state.currentView];
		currentView = action.data;

		return {
			...state,
			currentView
		};
	}
}, {
	views: {},
	currentView: 0,
	clickarea: {
		coords: null,
		goTo: null
	},
	fill: false,
	isNew: false
});
