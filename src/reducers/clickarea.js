import { handleActions } from 'redux-actions';
import update from 'react-addons-update';

export default handleActions({

	INIT: (state, action) => {
		return update(state, {
			init: {$set: true},
			initState: {$set: state},
			selectColor: {$set: false},
			createRect: {$set: false}
		});
	},

	RESET_INIT: (state, action) => {
		return update(state, {
			init: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
		});
	},

	ADD_CLICKAREA: (state, action) => {
		return update(state, {
			clickarea: {
				color: {$set: null},
				fill: {$set: true},
				goTo: {$set: 'figure'}
			},
			isNew: {$set: true},
			createRect: {$set: false},
			loadProject: {$set: false},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false},
			initLayer: {$set: false},
			selectColor: {$set: false}
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
			createRect: {$set: false},
			isNew: {$set: false},
			viewUpdate: {$set: false},
			scope: {$set: 'figure'},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false},
			initLayer: {$set: false},
			selectColor: {$set: false}
		});
	},

	UPDATE_CLICKAREA: (state, action) => {
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = action.data.index;

		if (typeof action.data.nodes[coordIndex][0].color === 'undefined') {
			action.data.nodes[coordIndex][0].color = '#6ec2b3';
		}

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
			isSelected: {$set: action.data.selected},
			coordIndex: {$set: action.data.index},
			initLayer: {$set: false},
			loadProject: {$set: false},
			scope: {$set: action.data.scope},
			saveCopy: {$set: false},
			cut: {$set: false},
			paste: {$set: false},
			pasteClickarea: {$set: false},
			viewRemoved: {$set: false},
			resetRemoved: {$set: false},
			show: {$set: false},
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false},
			color: {$set: action.data.nodes[coordIndex][0].color}
		});
	},

	REMOVE_CLICKAREA: (state, action) => {
		let views = state.views;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		delete views[view].clickareas[action.data];

		// update keys after delete
		for (var i in views[view].clickareas) {
			if (i > action.data) {
				views[view].clickareas[i - 1] = views[view].clickareas[i];
				delete views[view].clickareas[i];
			}
		}

		let clickareas = views[view].clickareas;

		return update(state, {
			views: {
				[view]: {
					clickareas: {$set: clickareas}
				}
			},
			loadProject: {$set: false},
			isNew: {$set: false}
		});
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
			loadWorkspace: {$set: false},
			initLayer: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
				loadWorkspace: {$set: false},
				selectColor: {$set: false},
				createRect: {$set: false}
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
				loadWorkspace: {$set: false},
				selectColor: {$set: false},
				createRect: {$set: false}
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
						clickareas: {
						}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			currentView: {$set: currentView},
			createRect: {$set: false}
		});
	},

	SET_OPACITY: (state, action) => {
		return update(state, {
			opacity: {$set: action.data}
		});
	},

	RESET_REMOVE_VIEW: (state, action) => {
		return update(state, {
			viewRemoved: {$set: false},
			resetRemoved: {$set: true},
			show: {$set: false},
			isSelected: {$set: false},
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false},
			addLayer: {$set: false}
		});
	},

	SELECT_COLOR: (state, action) => {
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');
		let coordIndex = state.coordIndex;

		console.log('rColor', action.data.hex)

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
			loadWorkspace: {$set: false},
			colorIndex: {$set: coordIndex},
			selectColor: {$set: true},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			isSelected: {$set: false},
			initLayer: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
		});
	},

	CUT_CLICKAREA: (state, action) => {
		let views = state.views;
		let currentView = state.currentView;
		let view = currentView.replace(/(.*)\.(.*?)$/, '$1');

		console.log(views[view].clickareas, views[view].clickareas[state.coordIndex]);
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
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
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
		});
	},

	CREATE_RECT: (state, action) => {
		return update(state, {
			rect: {$set: action.data},
			createRect: {$set: false}
		});
	},

	RESET_PROJECT: (state, action) => {
		return update(state, {
			loadProject: {$set: false},
			savedProject: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
		});
	},

	SET_LOADPROJECT: (state, acton) => {
		return update(state, {
			loadProject: {$set: true},
			savedProject: {$set: true},
			selectColor: {$set: false},
			createRect: {$set: false}
		});
	},

	LOAD_PROJECT: (state, action) => {
		let projectName = (action.data.projectName.length > 0)
			? action.data.projectName : '';

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
			savedProject: {$set: true},
			scope: {$set: 'project'},
			tool: {$set: action.data.tool},
			viewUpdate: {$set: action.data.viewUpdate},
			views: {$set: action.data.views},
			projectName: {$set: projectName},
			loadWorkspace: {$set: false},
			selectColor: {$set: false},
			createRect: {$set: false}
		});
	},
	DRAW_RECT: (state, action) => {
		return update(state, {
			createRect: {$set: true}
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
				onload: {$set: action.data.onload},
				scope: {$set: 'project'}
			});
		} else {
			return update(state, {
				workspace: {$set: action.data.workspace.workspace},
				loadWorkspace: {$set: false},
				onload: {$set: action.data.onload},
				selectColor: {$set: false},
				createRect: {$set: false},
				scope: {$set: 'project'}
			});
		}
	}
}, {
	initState: null,
	views: {},
	clickareas: {},
	colors: [],
	colorIndex: null,
	coordIndex: 0,
	currentView: '',
	color: '#6ec2b3',
	tool: 'selectAll',
	fill: true,
	addLayer: true,
	initLayer: false,
	isNew: false,
	opacity: 0.7,
	eraseColor: false,
	isSelected: false,
	viewUpdate: false,
	loadProject: false,
	viewRemoved: false,
	rect: {},
	createRect: false,
	projectName: '',
	scope: 'project',
	copy: {},
	saveCopy: false,
	getCopy: false,
	cut: false,
	paste: false,
	resetRemoved: false,
	show: false,
	selectColor: false,
	content: {},
	cutItem: {},
	onload: false,
	savedProject: false,
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
	clickarea: {coords: null, goTo: '', bbox: {}}
});
