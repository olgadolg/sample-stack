import { handleActions } from 'redux-actions';

export default handleActions({

	ADD_CLICKAREA: (state, action) => {
		let clickarea = {...state.clickarea};
		let isNew = [...state.isNew];

		clickarea.goTo = action.payload.name;
		isNew = true;

		return {
			...state,
			clickarea,
			isNew
		};
	},

	CREATE_CLICKAREA: (state, action) => {
		let _state = {...state};
		let views = {...state.views};
		let viewUpdate = [...state.viewUpdate];
		let isNew = [...state.isNew];
		var isSelected = [...state.isSelected];

		let currentView = _state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		views[view].nodes = action.data.nodes;
		views[view].edges = action.data.edges;

		views[view]['clickareas'][Object.keys(views[view].clickareas).length] = action.data.clickarea;
		isNew = false;
		isSelected = false;
		viewUpdate = false;

		return {
			...state,
			views,
			currentView,
			isSelected,
			viewUpdate,
			isNew
		};
	},

	UPDATE_CLICKAREA: (state, action) => {
		let _state = {...state};
		let views = {...state.views};
		let viewUpdate = [...state.viewUpdate];
		let isNew = [...state.isNew];
		let currentView = _state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		isNew = false;
		viewUpdate = false;

		views[view].nodes = action.data.nodes;
		views[view].edges = action.data.edges;

		views[view].clickareas[action.data.index].coords = action.data.coords;

		return {
			...state,
			views,
			currentView,
			viewUpdate,
			isNew
		};
	},

	REMOVE_CLICKAREA: (state, action) => {
		let views = {...state.views};
		let isNew = [...state.isNew];

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
		let views = {...state.views};
		let currentView = [...state.currentView];
		let viewUpdate = [...state.viewUpdate];
		let isNew = [...state.isNew];

		isNew = false;
		viewUpdate = true;
		currentView = action.data.image;

		views[action.data.fileName] = {
			viewId: action.data.fileName,
			image: action.data.image,
			nodes: [],
			edges: [],
			clickareas: {}
		};

		return {
			...state,
			views,
			isNew,
			viewUpdate,
			currentView
		};
	},

	UPDATE_VIEW: (state, action) => {
		let _state = {...state};
		var viewUpdate = [...state.viewUpdate];
		var isNew = [...state.isNew];
		var isSelected = [...state.isSelected];

		isNew = false;
		isSelected = true;
		viewUpdate = true;

		let currentView = _state.currentView;
		currentView = action.data.view;

		return {
			...state,
			isNew,
			isSelected,
			viewUpdate,
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
	isNew: false,
	isSelected: false,
	viewUpdate: false
});
