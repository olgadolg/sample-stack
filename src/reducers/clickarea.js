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
		let isSelected = [...state.isSelected];
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
		let isSelected = [...state.isSelected];
		let currentView = _state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		isNew = false;
		viewUpdate = false;
		isSelected = false;

		views[view].nodes = action.data.nodes;
		views[view].edges = action.data.edges;
		views[view].clickareas[action.data.index].coords = action.data.coords;

		return {
			...state,
			views,
			currentView,
			viewUpdate,
			isNew,
			isSelected
		};
	},

	REMOVE_CLICKAREA: (state, action) => {
		let _state = {...state};
		let views = {...state.views};
		let isNew = [...state.isNew];
		let currentView = _state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		isNew = false;
		delete views[view].clickareas[action.data];

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

	INIT_LAYER: (state, action) => {
		let views = {...state.views};
		let isNew = [...state.isNew];
		let viewUpdate = [...state.viewUpdate];
		let currentView = [...state.currentView];

		isNew = false;
		viewUpdate = true;
		currentView = action.data.image;

		delete 	views[action.data.currentView];

		views[action.data.fileName] = {
			viewId: action.data.fileName,
			image: action.data.image,
			fileData: action.data.fileData,
			nodes: [],
			edges: [],
			clickareas: {}

		};

		return {
			...state,
			views,
			isNew,
			currentView,
			viewUpdate
		};
	},

	ADD_LAYER: (state, action) => {
		let views = {...state.views};
		let currentView = [...state.currentView];
		let viewUpdate = [...state.viewUpdate];
		let isNew = [...state.isNew];

		isNew = false;
		viewUpdate = true;
		currentView = 'untitled ' + parseInt(Object.keys(views).length + 1);

		views[currentView] = {
			viewId: currentView,
			image: currentView,
			//viewId: action.data.fileName,
			//image: action.data.image,
			//fileData: action.data.fileData,
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

	ADD_VIEW: (state, action) => {
		let views = {...state.views};
		let currentView = [...state.currentView];
		let viewUpdate = [...state.viewUpdate];
		let isNew = [...state.isNew];

		isNew = false;
		viewUpdate = true;
		currentView = action.data.image;

		views[action.data.fileName] = {
			viewId: 'untitled ' + parseInt(Object.keys(views).length + 1),
			//viewId: action.data.fileName,
			//image: action.data.image,
			//fileData: action.data.fileData,
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
		let viewUpdate = [...state.viewUpdate];
		let isNew = [...state.isNew];
		let isSelected = [...state.isSelected];
		let currentView = _state.currentView;

		isNew = false;
		isSelected = true;
		viewUpdate = true;
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
	currentView: '',
	fill: false,
	isNew: false,
	isSelected: false,
	viewUpdate: false,
	clickarea: { coords: null, goTo: null }
});
