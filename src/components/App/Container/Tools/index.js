import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import styles from './styles/styles.css';
import { selectTool } from '../../../../actions/controls';
import { pasteClickarea, cutClickarea, unselectClickarea, getCopy } from '../../../../actions/clickarea';
import { removeWorkspace, loadWorkspace } from '../../../../actions/workspace';
import { addLayer } from '../../../../actions/layer';
import { removeArtboard, loadArtboard } from '../../../../actions/artboard';
import { exportProject, save, load } from '../../../../actions/project';
import { showDialog } from '../../../../actions/dialog';
import config from 'json!../../../../../assets/json/dialogs.json';
import { drawRect } from '../../../../actions/clickarea';

export default class Toolbox extends Component {

	constructor () {
		super();

		this.state = {
			pen: false,
			penAdd: false,
			penRemove: false,
			select: false,
			selectAll: true,
			copy: false,
			rectangle: false,
			stepBefore: false,
			bezier: false,
			cardinal: false,
			circle: false,
			currentView: 'untitled 1',
			tool: 'Pen Tool',
			toolName: 'Pen Tool'
		};

		this.saveProject = this.saveProject.bind(this);
		this.exportProject = this.exportProject.bind(this);
		this.loadProject = this.loadProject.bind(this);
		this.onToolClick = this.onToolClick.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.showRectDialog = this.showRectDialog.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.setState({currentView: nextProps.currentView});

		if (nextProps.currentView.indexOf('Layer') > -1) {
			$('.layerIcon, #layerIcon').css({
				'pointer-events': 'none',
				'opacity': 0.5
			});
		} else {
			$('.layerIcon, #layerIcon').css({
				'pointer-events': 'all',
				'opacity': 1
			});
		}
	}

	showRectDialog (e) {
		const data = config.dialogs.createRect;
		data.callback = { func: drawRect };
		this.props.dispatch(showDialog(data));
	}

	loadProject (event) {
		event.preventDefault();

		let reader = new FileReader();
		let file = event.target.files[0];
		reader.readAsText(event.target.files[0]);

		reader.onload = ((theFile) => {
			return (e) => {
				this.setState({ json: e.target.result }, () => {
					var object = JSON.parse(e.target.result);
					this.props.dispatch(load(object.clickareas));
				});
			};
		})(file);
	}

	exportProject () {
		let stateToExport = { clickareas: this.props.clickareas };
		this.props.dispatch(exportProject(stateToExport));
	}

	saveProject () {
		let stateToSave = { clickareas: this.props.clickareas };
		this.props.dispatch(save(stateToSave));
	}

	handleArtboardClick (event, type) {
		this.props.dispatch(removeArtboard());
	}

	handleDoubleClick (event, type) {
		this.props.dispatch(removeWorkspace());
	}

	onToolClick (event, type) {
		let tools = document.getElementsByClassName('tool');
		let obj = {};

		for (var i = 0; i < tools.length; i++) {
			tools[i].classList.remove('selectedTool');
		}

		event.target.classList.add('selectedTool');

		for (let item in this.state) {
			if (type === item) {
				obj[type] = true;
			} else if (item !== 'currentView' && item !== 'tool') {
				obj[item] = false;
			}
		}

		if (type === 'artboard') {
			this.props.dispatch(loadArtboard(this.props.clickareas, true));
		}

		if (type === 'workspace') {
			this.props.dispatch(loadWorkspace({workspace: this.props.workspace}, true, false));
		}

		(type === 'rectangle')
			? $('.ghostRect').show()
			: $('.ghostRect').hide();

		if ($('.canvasIcon').attr('src').length) {
			if (type === 'copy') {
				if ($('.overlay.selected').length === 0) return;
				this.props.dispatch(getCopy());
			}

			if (type === 'cut') {
				if (!$('.cutIcon').hasClass('paste')) {
					if ($('.overlay.selected').length === 0) return;
				}

				$('.cutIcon').toggleClass('paste');
				$('.cutIcon').hasClass('paste')
					? this.props.dispatch(cutClickarea())
					: this.props.dispatch(pasteClickarea());
			}
		}

		this.setState(obj, () => {
			var isSelected;

			if (type === 'layer') {
				$('.dropzone').show();
				this.props.dispatch(addLayer());
				this.props.dispatch(unselectClickarea());
			}

			if (type !== 'layer') {
				for (var tool in this.state) {
					if (this.state[tool] === true) {
						isSelected = tool;
					}
				}

				if ($('.canvasIcon').attr('src').length) {
					this.props.dispatch(selectTool(isSelected));
				}
			}
		});
	}

	render () {
		const toolBox = classnames({
			'toolBox': true,
			[styles.toolBox]: true
		});

		const penIcon = classnames({
			'tool': true,
			'penIcon': true,
			[styles.tool]: true,
			[styles.penIcon]: true
		});

		const stepBeforeIcon = classnames({
			'tool': true,
			'stepBeforeIcon': true,
			[styles.tool]: true,
			[styles.stepBeforeIcon]: true
		});

		const penAddIcon = classnames({
			'tool': true,
			'penAddIcon': true,
			[styles.tool]: true,
			[styles.penAddIcon]: true
		});

		const penRemoveIcon = classnames({
			'tool': true,
			'penRemoveIcon': true,
			[styles.tool]: true,
			[styles.penRemoveIcon]: true
		});

		const selectIcon = classnames({
			'tool': true,
			'selectIcon': true,
			[styles.tool]: true,
			[styles.selectIcon]: true
		});

		const selectAllIcon = classnames({
			'tool': true,
			'selectAllIcon': true,
			[styles.tool]: true,
			[styles.selectAllIcon]: true
		});

		const layerIcon = classnames({
			'tool': true,
			'layerIcon': true,
			[styles.tool]: true,
			[styles.layerIcon]: true
		});

		const copyIcon = classnames({
			'tool': true,
			'copyIcon': true,
			[styles.tool]: true,
			[styles.copyIcon]: true
		});

		const cutIcon = classnames({
			'tool': true,
			'cutIcon': true,
			[styles.tool]: true,
			[styles.cutIcon]: true
		});

		const workspaceIcon = classnames({
			'tool': true,
			'workspaceIcon': true,
			[styles.tool]: true,
			[styles.workspaceIcon]: true
		});

		const resetWorkspaceIcon = classnames({
			'tool': true,
			'resetWorkspaceIcon': true,
			[styles.tool]: true,
			[styles.resetWorkspaceIcon]: true
		});

		const artboardIcon = classnames({
			'tool': true,
			'artboardIcon': true,
			[styles.tool]: true,
			[styles.artboardIcon]: true
		});

		const bezierIcon = classnames({
			'tool': true,
			'bezierIcon': true,
			[styles.tool]: true,
			[styles.bezierIcon]: true
		});

		const artboardWrapper = classnames({
			'artboardWrapper': true,
			[styles.artboardWrapper]: true
		});

		const setupWrapper = classnames({
			'setupWrapper': true,
			[styles.setupWrapper]: true
		});

		const rectIcon = classnames({
			'rectIcon': true,
			'tool': true,
			[styles.tool]: true,
			[styles.rectIcon]: true
		});

		const cardinalIcon = classnames({
			'cardinalIcon': true,
			'tool': true,
			[styles.tool]: true,
			[styles.cardinalIcon]: true
		});

		const downloadIcon = classnames({
			'downloadIcon': true,
			'tool': true,
			[styles.tool]: true,
			[styles.downloadIcon]: true
		});

		const exportIcon = classnames({
			'exportIcon': true,
			'tool': true,
			[styles.tool]: true,
			[styles.exportIcon]: true
		});

		const undoIcon = classnames({
			'undoIcon': true,
			'tool': true,
			[styles.tool]: true,
			[styles.undoIcon]: true
		});

		const fileWrapper = classnames({
			'fileWrapper': true,
			[styles.fileWrapper]: true
		});

		return (
			<div className={toolBox}>
				<button id="Select Figure"
					onClick={(e) => this.onToolClick(e, 'selectAll')}
					className={selectAllIcon}>
				</button>
				<button id="Select Point"
					onClick={(e) => this.onToolClick(e, 'select')}
					className={selectIcon}>
				</button>
				<button id="Rectangle"
					onDoubleClick={this.showRectDialog}
					onClick={(e) => this.onToolClick(e, 'rectangle')}
					className={rectIcon}>
				</button>
				<button id="Rounded Corners"
					onClick={(e) => this.onToolClick(e, 'stepBefore')}
					className={stepBeforeIcon}>
				</button>
				<button id="Pen Tool"
					onClick={(e) => this.onToolClick(e, 'pen')}
					className={penIcon}>
				</button>
				<button id="Bezier Curve"
					onClick={(e) => this.onToolClick(e, 'bezier')}
					className={bezierIcon}>
				</button>
				<button id="Cardinal"
					onClick={(e) => this.onToolClick(e, 'cardinal')}
					className={cardinalIcon}>
				</button>
				<button id="Add Point"
					onClick={(e) => this.onToolClick(e, 'penAdd')}
					className={penAddIcon}>
				</button>
				<button id="Remove Point"
					onClick={(e) => this.onToolClick(e, 'penRemove')}
					className={penRemoveIcon}>
				</button>
				<button id="Copy Figure"
					onClick={(e) => this.onToolClick(e, 'copy')}
					className={copyIcon}>
				</button>
				<button id="Cut / Paste"
					onClick={(e) => this.onToolClick(e, 'cut')}
					className={cutIcon}>
				</button>
				<button id="Undo"
					onClick={(e) => this.onToolClick(e, 'undo')}
					className={undoIcon}>
				</button>
				<button id="New Layer"
					onClick={(e) => this.onToolClick(e, 'layer')}
					className={layerIcon}>
				</button>
				<div className={setupWrapper}>
					<button id="Save Setup"
						onClick={(e) => this.onToolClick(e, 'workspace')}
						className={workspaceIcon}>
					</button>
					{(() => {
						if (this.props.init === false) {
							return (<button id="Reset save Workspace"
								onClick={(e) => this.handleDoubleClick(e, 'workspace')}
								className={resetWorkspaceIcon}>
							</button>);
						}
					})()}
				</div>
				<div className={artboardWrapper}>
					<button id="Save Artboard"
						onClick={(e) => this.onToolClick(e, 'artboard')}
						className={artboardIcon}>
					</button>

					{(() => {
						if (this.props.savedProject === true) {
							return (<button id="Reset save Artboard"
								onClick={(e) => this.handleArtboardClick(e, 'artboard')}
								className={resetWorkspaceIcon}>
							</button>);
						}
					})()}
				</div>
				<div className={fileWrapper}>
					<input
						type="file"
						name="file"
						id="file"
						onChange={(e) => this.loadProject(e)}
						className={styles.inputfile}
					/>
					<label for="file"></label>
					<button id="Download"
						onClick={this.saveProject}
						label="Save Project"
						className={downloadIcon}>
					</button>
					<button id="Export"
						onClick={this.exportProject}
						label="Export Project"
						className={exportIcon}>
					</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		clickareas: state.clickareas,
		views: state.views,
		tool: state.clickareas.tool,
		currentView: state.clickareas.currentView,
		initLayer: state.clickareas.initLayer,
		workspace: state.clickareas.workspace,
		init: state.clickareas.init,
		savedProject: state.clickareas.savedProject
	};
};

export default connect(mapStateToProps)(Toolbox);
