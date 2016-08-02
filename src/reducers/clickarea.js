import { handleActions } from 'redux-actions';

export default handleActions({

	ADD_CLICKAREA: (state, action) => {
		let clickarea = state.clickarea;
		let isNew = state.isNew;

		clickarea.goTo = action.payload.name;
		isNew = true;

		return {
			...state,
			clickarea,
			isNew
		};
	},

	CREATE_CLICKAREA: (state, action) => {
		let views = state.views;
		let viewUpdate = state.viewUpdate;
		let isNew = state.isNew;
		let isSelected = state.isSelected;
		let currentView = state.currentView;
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
		let views = state.views;
		let viewUpdate = state.viewUpdate;
		let isNew = state.isNew;
		let isSelected = state.isSelected;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = state.coordIndex;

		isNew = false;
		viewUpdate = false;
		isSelected = false;
		coordIndex = action.data.index;

		views[view].nodes = action.data.nodes;
		views[view].edges = action.data.edges;
		views[view].clickareas[action.data.index].coords = action.data.coords;

		return {
			...state,
			views,
			currentView,
			viewUpdate,
			isNew,
			isSelected,
			coordIndex
		};
	},

	REMOVE_CLICKAREA: (state, action) => {
		let views = state.views;
		let isNew = state.isNew;
		let currentView = state.currentView;
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
		let isNew = state.isNew;

		isNew = false;

		return {
			...state,
			fill: action.data,
			isNew
		};
	},

	INIT_LAYER: (state, action) => {
		let views = state.views;
		let isNew = state.isNew;
		let viewUpdate = state.viewUpdate;
		let currentView = state.currentView;
		let initLayer = state.initLayer;

		isNew = false;
		initLayer = true;
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
			initLayer,
			currentView,
			viewUpdate
		};
	},

	ADD_LAYER: (state, action) => {
		let views = state.views;
		let currentView = state.currentView;
		let viewUpdate = state.viewUpdate;
		let isNew = state.isNew;
		let addLayer = state.addLayer;

		isNew = false;
		addLayer = true;
		viewUpdate = true;
		currentView = 'untitled ' + parseInt(Object.keys(views).length + 1);

		views[currentView] = {
			viewId: currentView,
			image: currentView,
			nodes: [],
			edges: [],
			clickareas: {}
		};

		return {
			...state,
			views,
			isNew,
			viewUpdate,
			currentView,
			addLayer
		};
	},

	ADD_VIEW: (state, action) => {
		let views = state.views;
		let currentView = state.currentView;
		let viewUpdate = state.viewUpdate;
		let isNew = state.isNew;

		isNew = false;
		viewUpdate = true;
		currentView = action.data.image;

		views[action.data.fileName] = {
			viewId: 'untitled ' + parseInt(Object.keys(views).length + 1),
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

	SELECT_COLOR: (state, action) => {
		let views = state.views;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = state.coordIndex;
		let clickarea = views[view].clickareas[coordIndex];
		let colors = state.colors;

		colors[coordIndex] = {
			color: action.data.hex,
			view: view,
			clickarea: coordIndex
		};

		return {
			...state,
			color: action.data.hex,
			colors
		};
	},

	UPDATE_VIEW: (state, action) => {
		let viewUpdate = state.viewUpdate;
		let isNew = state.isNew;
		let isSelected = state.isSelected;
		let currentView = state.currentView;
		let initLayer = state.initLayer;

		isNew = false;
		isSelected = true;
		viewUpdate = true;
		initLayer = false;
		currentView = action.data.view;

		return {
			...state,
			isNew,
			isSelected,
			viewUpdate,
			currentView,
			initLayer
		};
	}
}, {
	views: {},
	colors: [],
	currentView: '',
	fill: false,
	addLayer: true,
	initLayer: false,
	isNew: false,
	coordIndex: 0,
	isSelected: false,
	viewUpdate: false,
	color: '#6ec2b3',
	clickarea: { coords: null, goTo: null }
});
