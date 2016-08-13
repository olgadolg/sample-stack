import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import styles from './styles/styles.css';
import { selectTool } from '../../../../actions/controls';
import { removeWorkspace, loadWorkspace, pasteClickarea, cutClickarea, unselectClickarea, getCopy } from '../../../../actions/clickarea';
import { addLayer } from '../../../../actions/layer';
import { removeArtboard, loadArtboard } from '../../../../actions/artboard';

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
			currentView: 'untitled 1',
			tool: 'Pen Tool',
			toolName: 'Pen Tool'
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.setState({currentView: nextProps.currentView});

		if (nextProps.initLayer === true) {
			let selectedtool = document.getElementById('selectedtool');
			selectedtool.innerHTML = 'Select Figure';
		}

		if (nextProps.currentView.indexOf('Layer') > -1) {
			let layerIcon = document.getElementsByClassName('layerIcon');
			layerIcon[0].style.pointerEvents = 'none';
			layerIcon[0].style.opacity = 0.5;
		} else {
			let layerIcon = document.getElementsByClassName('layerIcon');
			layerIcon[0].style.pointerEvents = 'all';
			layerIcon[0].style.opacity = 1;
		}
	}

	handleArtboardClick (event, type) {
		this.props.dispatch(removeArtboard());
	}

	handleDoubleClick (event, type) {
		this.props.dispatch(removeWorkspace());
	}

	handleClick (event, type) {
		let obj = {};
		let tools = document.getElementsByClassName('tool');
		let toolSelected = document.getElementById('selectedtool');

		for (var i = 0; i < tools.length; i++) {
			tools[i].classList.remove('selectedTool');
		}

		event.target.classList.add('selectedTool');
		toolSelected.innerHTML = event.target.id;

		for (let item in this.state) {
			if (type === item) {
				obj[type] = true;
			} else if (item !== 'currentView' && item !== 'tool') {
				obj[item] = false;
			}
		}

		if (type === 'artboard') {
			console.log('clickareas', this.props.clickareas)
			this.props.dispatch(loadArtboard(this.props.clickareas, true));
		}

		if (type === 'workspace') {
			this.props.dispatch(loadWorkspace(
				{workspace: this.props.workspace},
				true, false)
			);
		}

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

				this.props.dispatch(selectTool(isSelected));
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
			'selectedTool': true,
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

		return (
			<div className={toolBox}>
				<div id="Select Figure"
					onClick={(e) => this.handleClick(e, 'selectAll')}
					className={selectAllIcon}>
				</div>
				<div id="Select Point"
					onClick={(e) => this.handleClick(e, 'select')}
					className={selectIcon}>
				</div>
				<div id="Pen Tool"
					onClick={(e) => this.handleClick(e, 'pen')}
					className={penIcon}>
				</div>
				<div id="Add Point"
					onClick={(e) => this.handleClick(e, 'penAdd')}
					className={penAddIcon}>
				</div>
				<div id="Remove Point"
					onClick={(e) => this.handleClick(e, 'penRemove')}
					className={penRemoveIcon}>
				</div>
				<div id="Copy Figure"
					onClick={(e) => this.handleClick(e, 'copy')}
					className={copyIcon}>
				</div>
				<div id="Cut / Paste"
					onClick={(e) => this.handleClick(e, 'cut')}
					className={cutIcon}>
				</div>
				<div id="New Layer"
					onClick={(e) => this.handleClick(e, 'layer')}
					className={layerIcon}>
				</div>
				<div id="Save Setup"
					onClick={(e) => this.handleClick(e, 'workspace')}
					className={workspaceIcon}>
				</div>
				<div id="Save Artboard"
					onDoubleClick={(e) => this.handleArtboardClick(e, 'artboard')}
					onClick={(e) => this.handleClick(e, 'artboard')}
					className={artboardIcon}>

					{(() => {
						if (this.props.init === false) {
							return (<div id="Reset save Workspace"
								onClick={(e) => this.handleDoubleClick(e, 'workspace')}
								className={resetWorkspaceIcon}>
							</div>);
						}
					})()}

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
		init: state.clickareas.init
	};
};

export default connect(mapStateToProps)(Toolbox);
