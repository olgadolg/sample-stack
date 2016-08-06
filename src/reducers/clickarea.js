import { handleActions } from 'redux-actions';
import update from 'react-addons-update';

export default handleActions({

	ADD_CLICKAREA: (state, action) => {
		return update(state, {
			clickarea: {
				color: {$set: null},
				fill: {$set: true}

			},
			isNew: {$set: true},
			loadProject: {$set: false},
			saveCopy: {$set: false}

		});
	},

	CREATE_CLICKAREA: (state, action) => {
		let views = state.views;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = Object.keys(views[view].clickareas).length;

		console.log('coordIndex', coordIndex, action.data.clickarea);

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
			viewUpdate: {$set: false},
			loadProject: {$set: false},
			scope: {$set: 'figure'},
			saveCopy: {$set: false}
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
			isSelected: {$set: action.data.selected},
			coordIndex: {$set: action.data.index},
			initLayer: {$set: false},
			loadProject: {$set: false},
			scope: {$set: 'figure'},
			saveCopy: {$set: false}
		});
	},

	REMOVE_CLICKAREA: (state, action) => {
		let views = state.views;
		let isNew = state.isNew;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let loadProject = false;

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
			isNew,
			loadProject
		};
	},

	UNSELECT_CLICKAREA: (state, action) => {
		return update(state, {
			isSelected: {$set: false},
			loadProject: {$set: false},
			scope: {$set: 'project'},
			saveCopy: {$set: false}
		});
	},

	TITLE_CLICKAREA: (state, action) => {
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = state.coordIndex;

		if (action.data.scope === 'figure') {
			return update(state, {
				views: {
					[view]: {
						clickareas: {
							[coordIndex]: {
								goTo: {$set: action.data.html}
							}
						}
					}
				},
				clickareaName: {$set: action.data.html},
				loadProject: {$set: false},
				scope: {$set: action.data.scope},
				saveCopy: {$set: false}
			});
		} else {
			return update(state, {
				projectName: {$set: action.data.html},
				scope: {$set: action.data.scope},
				saveCopy: {$set: false}
			});
		}
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
			initLayer: {$set: true},
			addLayer: {$set: false},
			currentView: {$set: action.data.image},
			loadProject: {$set: false},
			saveCopy: {$set: false}
		});
	},

	ADD_LAYER: (state, action) => {
		let views = state.views;
		let currentView = 'Layer ' + parseInt(Object.keys(views).length + 1);

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
			currentView: {$set: currentView},
			loadProject: {$set: false},
			saveCopy: {$set: false}
		});
	},

	UPDATE_VIEW: (state, action) => {
		return update(state, {
			isNew: {$set: false},
			isSelected: {$set: true},
			viewUpdate: {$set: true},
			initLayer: {$set: false},
			currentView: {$set: action.data.view},
			loadProject: {$set: false},
			saveCopy: {$set: false}
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
			},
			eraseColor: {$set: false},
			loadProject: {$set: false},
			saveCopy: {$set: false},
			color: {$set: action.data.hex}
		});
	},

	UPDATE_FILL: (state, action) => {
		return update(state, {
			fill: {$set: action.data},
			isNew: {$set: false},
			loadProject: {$set: false},
			saveCopy: {$set: false}
		});
	},

	REMOVE_COLOR: (state, action) => {
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = state.coordIndex;

		return update(state, {
			views: {
				[view]: {
					clickareas: {
						[coordIndex]: {
							color: {$set: 'rgba(255, 255, 255, 0)'}
						}
					}
				}
			},
			eraseColor: {$set: true},
			loadProject: {$set: false},
			saveCopy: {$set: false}
		});
	},

	SELECT_TOOL: (state, action) => {
		return update(state, {
			tool: {$set: action.data},
			loadProject: {$set: false},
			saveCopy: {$set: false}
		});
	},

	SAVE_COPY: (state, action) => {

		console.log('action2', action.data.nodes)

		return update(state, {
			copy: {$set: action.data},
			isNew: {$set: false},
			isSelected: {$set: false},
			viewUpdate: {$set: false},
			initLayer: {$set: false},
			loadProject: {$set: false},
			saveCopy: {$set: true},
			getCopy: {$set: false},
			coordIndex: {$set: state.coordIndex++}
		});
	},

	GET_COPY: (state, action) => {
		return update(state, {
			saveCopy: {$set: false},
			getCopy: {$set: true},
			copy: {$set: {}}

		});
	},

	LOAD_PROJECT: (state, action) => {
		action.data = action.data.clickareas;

		return update(state, {
			addLayer: {$set: action.data.addLayer},
			artistState: {$set: action.data.artistState},
			artistSettings: {$set: action.data.artistSettings},
			clickarea: {$set: action.data.clickarea},
			clickareas: {$set: action.data.clickareas},
			coordIndex: {$set: action.data.coordIndex},
			currentView: {$set: action.data.currentView},
			eraseColor: {$set: action.data.eraseColor},
			fill: {$set: action.data.fill},
			initLayer: {$set: action.data.initLayer},
			isNew: {$set: action.data.isNew},
			isSelected: {$set: action.data.isSelected},
			loadProject: {$set: true},
			tool: {$set: action.data.tool},
			viewUpdate: {$set: action.data.viewUpdate},
			views: {$set: action.data.views},
			projectName: {$set: action.data.projectName},
			scope: {$set: action.data.scope}
		});
	}
}, {
	views: {},
	clickareas: {},
	colors: [],
	coordIndex: 0,
	currentView: '',
	color: '#6ec2b3',
	tool: 'pen',
	fill: true,
	addLayer: true,
	initLayer: false,
	isNew: false,
	eraseColor: false,
	isSelected: false,
	viewUpdate: false,
	loadProject: false,
	projectName: '',
	scope: 'project',
	copy: {},
	saveCopy: false,
	getCopy: false,
	clickarea: { coords: null, goTo: '' }
});
