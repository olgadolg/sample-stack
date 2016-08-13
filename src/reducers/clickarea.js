import { handleActions } from 'redux-actions';
import update from 'react-addons-update';

export default handleActions({

	INIT: (state, action) => {
		return update(state, {
			init: {$set: true},
			onload: {$set: false}
		});
	},

	ADD_CLICKAREA: (state, action) => {
		return update(state, {
			clickarea: {
				color: {$set: null},
				fill: {$set: true}

			},
			isNew: {$set: true},
			loadProject: {$set: false},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false}
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
			viewUpdate: {$set: false},
			loadProject: {$set: false},
			scope: {$set: 'figure'},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
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
							coords: {$set: action.data.coords},
							bbox: {$set: action.data.bbox}
						}
					}
				}
			},
			viewUpdate: {$set: false},
			isNew: {$set: false},
			isSelected: {$set: true},
			coordIndex: {$set: action.data.index},
			initLayer: {$set: false},
			loadProject: {$set: false},
			scope: {$set: 'figure'},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	REMOVE_CLICKAREA: (state, action) => {
		let views = state.views;
		let isNew = state.isNew;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let loadProject = false;

		isNew = false;
		delete views[view].clickareas[action.data.index];

		// update keys after delete
		for (var i in views[view].clickareas) {
			if (i > action.data.index) {
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
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
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
				saveCopy: {$set: false},
				cut: {$set: false},
				paste: {$set: false},
				pasteClickarea: {$set: false},
				viewRemoved: {$set: false},
				resetRemoved: {$set: false},
				show: {$set: false},
				isSelected: {$set: false},
				loadWorkspace: {$set: false}
			});
		} else {
			return update(state, {
				projectName: {$set: action.data.html},
				scope: {$set: action.data.scope},
				saveCopy: {$set: false},
				cut: {$set: false},
				paste: {$set: false},
				pasteClickarea: {$set: false},
				viewRemoved: {$set: false},
				resetRemoved: {$set: false},
				show: {$set: false},
				isSelected: {$set: false},
				loadWorkspace: {$set: false}
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
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
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
			viewUpdate: {$set: false},
			currentView: {$set: currentView},
			loadProject: {$set: false},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	UPDATE_VIEW: (state, action) => {
		return update(state, {
			isNew: {$set: false},
			isSelected: {$set: false},
			viewUpdate: {$set: true},
			initLayer: {$set: false},
			currentView: {$set: action.data.view},
			loadProject: {$set: false},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			addLayer: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	REMOVE_VIEW: (state, action) => {
		let views = state.views;
		delete views[action.data];

		let currentView = (Object.keys(views).length)
			? Object.keys(views)[Object.keys(views).length - 1]
			: '';

		return update(state, {
			viewRemoved: {$set: true},
			currentView: {$set: currentView}
		});
	},

	RESET_REMOVE_VIEW: (state, action) => {
		return update(state, {
			viewRemoved: {$set: false},
			resetRemoved: {$set: true},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false}
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
			color: {$set: action.data.hex},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	UPDATE_FILL: (state, action) => {
		return update(state, {
			fill: {$set: action.data},
			isNew: {$set: false},
			loadProject: {$set: false},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false}
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
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	SELECT_TOOL: (state, action) => {
		return update(state, {
			tool: {$set: action.data},
			loadProject: {$set: false},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			addLayer: {$set: false},
			show: {$set: false},
			isSelected: {$set: false}
		});
	},

	SAVE_COPY: (state, action) => {
		return update(state, {
			copy: {$set: action.data},
			isNew: {$set: false},
			isSelected: {$set: false},
			viewUpdate: {$set: false},
			initLayer: {$set: false},
			loadProject: {$set: false},
			saveCopy: {$set: true},
			getCopy: {$set: false},
			coordIndex: {$set: state.coordIndex++},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	GET_COPY: (state, action) => {
		return update(state, {
			saveCopy: {$set: false},
			getCopy: {$set: true},
			copy: {$set: {}},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	CUT_CLICKAREA: (state, action) => {
		let views = state.views;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		delete views[view].clickareas[state.coordIndex];

		// update keys after delete
		for (var i in views[view].clickareas) {
			if (i > state.coordIndex) {
				views[view].clickareas[i - 1] = views[view].clickareas[i];
				delete views[view].clickareas[i];
			}
		}

		return update(state, {
			cut: {$set: true},
			cutItem: {$set: {}},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	SAVE_CUT: (state, action) => {
		return update(state, {
			cutItem: {$set: {
				nodes: action.data.nodes,
				edges: action.data.edges
			}},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	PASTE_CUT: (state, action) => {
		return update(state, {
			paste: {$set: true},
			cut: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
		});
	},

	PASTE_CLICKAREA: (state, action) => {
		return update(state, {
			pasteClickarea: {$set: true},
			cut: {$set: false},
			paste: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false}
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
			scope: {$set: action.data.scope},
			loadWorkspace: {$set: false}
		});
	},
	SHOW_DIALOG: (state, action) => {
		return update(state, {
			show: {$set: true},
			content: {$set: action.data}
		});
	},

	HIDE_DIALOG: (state, action) => {
		return update(state, {
			show: {$set: false}
		});
	},

	LOAD_WORKSPACE: (state, action) => {
		return update(state, {
			loadWorkspace: {$set: true}
		});
	},

	SAVE_WORKSPACE: (state, action) => {
		var element = action.data.workspace.name;

		if (action.data.load === false && typeof element !== 'undefined') {
			return update(state, {
				workspace: {
					[element]: {$set: {
						x: action.data.workspace.x,
						y: action.data.workspace.y}
					}
				},
				loadWorkspace: {$set: false},
				onload: {$set: action.data.onload}
			});
		} else {
			return update(state, {
				workspace: {$set: action.data.workspace.workspace},
				loadWorkspace: {$set: false},
				onload: {$set: action.data.onload}
			});
		}
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
	viewRemoved: false,
	projectName: '',
	scope: 'project',
	copy: {},
	saveCopy: false,
	getCopy: false,
	cut: false,
	paste: false,
	resetRemoved: false,
	show: false,
	content: {},
	cutItem: {},
	onload: false,
	init: false,
	workspace: {
		canvasWrapper: {
			x: 0,
			y: 0
		},
		header: {
			x: 0,
			y: 0
		},
		controlsContainer: {
			x: 0,
			y: 0
		}
	},
	viewRemvoved: false,
	clickarea: {coords: null, goTo: 'Figure', bbox: {}}
});
