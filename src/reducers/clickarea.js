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
			_state = {...state},
			views = {...state.views},
			viewUpdate = [...state.viewUpdate],
			isNew = [...state.isNew];

		let currentView = _state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		views[view].nodes = action.data.nodes;
		views[view].edges = action.data.edges;

		views[view]['clickareas'][Object.keys(views[view].clickareas).length] = action.data.clickarea;
		isNew = false;
		viewUpdate = false;

		return {
			...state,
			views,
			currentView,
			viewUpdate,
			isNew
		};
	},

	UPDATE_CLICKAREA: (state, action) => {
		let
			_state = {...state},
			views = {...state.views},
			viewUpdate = [...state.viewUpdate],
			isNew = [...state.isNew];

		let currentView = _state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		isNew = false;
		viewUpdate = false;

		console.log('fuckfuck', action.data)

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
		let
			views = {...state.views},
			isNew = [...state.isNew];

		isNew = false;

		delete views[action.data];

		//views.nodes = action.data.nodes;
		//views.edges = action.data.edges;

		return {
			...state,
			views,
			currentView,
			isNew
		};
	},

	UPDATE_FILL: (state, action) => {
		let isNew = [...state.isNew];
		let viewUpdate = [...state.viewUpdate];


		isNew = false;
		viewUpdate = false;

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
			viewUpdate = [...state.viewUpdate],
			isNew = [...state.isNew];

		isNew = false;
		viewUpdate = false;
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

	SELECT_UPDATE_VIEW: (state, action) => {

		console.log('views...............', action)
		let view = action.data.view.replace(/(.*)\.(.*?)$/, '$1');

		let _state = {...state};
		let views = {...state.views};
		var viewUpdate = [...state.viewUpdate];
		var isNew = [...state.isNew];

		view = action.data.view.replace(/(.*)\.(.*?)$/, '$1');

		isNew = false;
		viewUpdate = false;

		let currentView = _state.currentView;
		currentView = action.data.view;

		/*
		for (var i in views) {
			if (i == view) {
				console.log('in view loop now.......................', i)
				views[i].nodes = action.data.nodes;
				views[i].edges = action.data.edges;
			}
		}
		*/

		return {
			...state,
			isNew,
			viewUpdate,
			currentView
		};
	},

	UPDATE_VIEW: (state, action) => {
		let _state = {...state};
		let views = {...state.views};
		var viewUpdate = [...state.viewUpdate];
		var isNew = [...state.isNew];

		isNew = false;
		viewUpdate = true;

		let currentView = _state.currentView;
		currentView = action.data.view;

		//let view = action.data.view.replace(/(.*)\.(.*?)$/, '$1');

		//views[view].nodes = action.data.nodes;
		//views[view].edges = action.data.edges;

		console.log(views.length)

		for (var i in views) {

			console.log('enter view loop', i);

			/*
			if (i == view) {
				console.log('in view loop now.......................', i)
				views[view].nodes = action.data.nodes;
				views[view].edges = action.data.edges;
			}
			*/
		}

		return {
			...state,
			isNew,
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
	viewUpdate: false
});
