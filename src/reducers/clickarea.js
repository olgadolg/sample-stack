import { handleActions } from 'redux-actions';
import update from 'react-addons-update';

export default handleActions({

	ADD_CLICKAREA: (state, action) => {
		return update(state, {
			clickarea: {
				goTo: {$set: action.payload.name}

			},
			isNew: {$set: true}
		});
	},

	CREATE_CLICKAREA: (state, action) => {
		let views = state.views;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = Object.keys(views[view].clickareas).length;

		return update(state, {
			views: {
				[view]: {
					nodes: {$set: action.data.nodes},
					edges: {$set: action.data.edges},
					clickareas: {
						[coordIndex]: {
							$set: action.data.clickarea
						}
					}
				}
			},
			isSelected: {$set: false},
			isNew: {$set: false},
			viewUpdate: {$set: false}
		});
	},

	UPDATE_CLICKAREA: (state, action) => {
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = action.data.index;

		return update(state, {
			views: {
				[view]: {
					nodes: {$set: action.data.nodes},
					edges: {$set: action.data.edges},
					clickareas: {
						[coordIndex]: {
							coords: {$set: action.data.coords}
						}
					}
				}
			},
			viewUpdate: {$set: false},
			isNew: {$set: false},
			isSelected: {$set: false},
			coordIndex: {$set: action.data.index}
		});
	},

	REMOVE_CLICKAREA: (state, action) => {
		let views = state.views;
		let isNew = state.isNew;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		isNew = false;
		delete views[view].clickareas[action.data];

		return {
			...state
			//views,
			//isNew
		};
	},

	UPDATE_FILL: (state, action) => {
		return update(state, {
			fill: {$set: action.data},
			isNew: {$set: false}
		});
	},

	INIT_LAYER: (state, action) => {
		let views = state.views;
		delete views[action.data.currentView];

		return update(state, {
			views: {
				[action.data.fileName]: {
					$set: {
						viewId: action.data.fileName,
						image: action.data.image,
						fileData: action.data.fileData,
						nodes: [],
						edges: [],
						clickareas: {}
					}
				}
			},
			currentView: {$set: action.data.image}
		});
	},

	ADD_LAYER: (state, action) => {
		let views = state.views;
		let currentView = 'untitled ' + parseInt(Object.keys(views).length + 1);

		return update(state, {
			views: {
				[currentView]: {
					$set: {
						viewId: currentView,
						image: currentView,
						nodes: [],
						edges: [],
						clickareas: {}
					}
				}
			},
			isNew: {$set: false},
			addLayer: {$set: true},
			viewUpade: {$set: true},
			currentView: {$set: currentView}
		});
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
	clickareas: {},
	clickarea: { coords: null, goTo: null }
});
