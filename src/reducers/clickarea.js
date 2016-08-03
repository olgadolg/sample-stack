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

		// update keys after delete
		for (var i in views[view].clickareas) {
			if (i > action.data) {
				views[view].clickareas[i - 1] = views[view].clickareas[i];
				delete views[view].clickareas[i];
			}
		}

		return {
			...state,
			views,
			isNew
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
			addLayer: {$set: false},
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

		views[action.data.fileName] = {
			viewId: 'untitled ' + parseInt(Object.keys(views).length + 1),
			nodes: [],
			edges: [],
			clickareas: {}
		};

		return update(state, {
			views: {
				$set: {
					[action.data.fileName]: {
						viewId: 'untitled ' + parseInt(Object.keys(views).length + 1),
						nodes: [],
						edges: [],
						clickareas: {}
					}
				}
			},
			isNew: {$set: false},
			viewUpdae: {$set: true},
			currentView: {$set: action.data.image}
		});
	},

	SELECT_COLOR: (state, action) => {
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = state.coordIndex;

		return update(state, {
			views: {
				[view]: {
					clickareas: {
						[coordIndex]: {
							color: {$set: action.data.hex}
						}
					}
				}
			}
		});
	},

	UPDATE_VIEW: (state, action) => {
		return update(state, {
			isNew: {$set: false},
			isSelected: {$set: true},
			viewUpdate: {$set: true},
			initLayer: {$set: false},
			currentView: {$set: action.data.view}
		});
	}
}, {
	views: {},
	clickareas: {},
	colors: [],
	coordIndex: 0,
	currentView: '',
	color: '#6ec2b3',
	fill: false,
	addLayer: true,
	initLayer: false,
	isNew: false,
	isSelected: false,
	viewUpdate: false,
	clickarea: { coords: null, goTo: null }
});
