import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import styles from './styles/styles.css';
import { selectTool } from '../../../../actions/controls';
import { updateWorkspace, removeWorkspace, loadWorkspace, pasteClickarea, cutClickarea, unselectClickarea, getCopy } from '../../../../actions/clickarea';
import { addLayer } from '../../../../actions/layer';

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
			tool: 'Pen Tool'
		};

		this.handleClick = this.handleClick.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.setState({currentView: nextProps.currentView});

		if (nextProps.initLayer === true) {
			let selectedtool = document.getElementById('selectedtool');
			selectedtool.innerHTML = 'Pen Tool';
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

	handleMouseEnter (e, label) {
		let selectedTool = document.getElementById('selectedtool');
		selectedTool.innerHTML = label;
	}

	handleMouseLeave (e) {
		let selectedTool = document.getElementById('selectedtool');
		selectedTool.innerHTML = this.state.tool;
	}

	handleDoubleClick (event, type) {
		this.props.dispatch(removeWorkspace());
	}

	handleClick (event, type) {
		let obj = {};
		let toolSelected = document.getElementById('selectedtool');
		toolSelected.innerHTML = event.target.id;

		for (let item in this.state) {
			if (type === item) {
				obj[type] = true;
			} else if (item !== 'currentView') {
				obj[item] = false;
			}
		}

		if (type === 'workspace') {
			this.props.dispatch(loadWorkspace(
				{workspace: this.props.workspace},
				true, false)
			);
		}

		if (type === 'copy') {
			$('.tool').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(255, 255, 255, 1)'});
			$('.copyIcon').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(110, 194, 179, 1)'});
			if ($('.clickarea').length === 0) return;
			this.props.dispatch(getCopy());
		}

		if (type === 'cut') {
			$('.tool').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(255, 255, 255, 1)'});
			$('.cutIcon').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(110, 194, 179, 1)'});

			if ($('.cutIcon').hasClass('paste')) {
				if ($('.clickarea').length === 0) return;
			}

			$('.cutIcon').toggleClass('paste');
			$('.cutIcon').hasClass('paste')
				? this.props.dispatch(cutClickarea())
				: this.props.dispatch(pasteClickarea());
		}

		this.setState(obj, () => {
			var isSelected;

			if (type === 'layer') {
				$('.tool').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(255, 255, 255, 1)'});
				$('.layerIcon').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(110, 194, 179, 1)'});
				$('.dropzone').show();
				this.props.dispatch(addLayer());
				this.props.dispatch(unselectClickarea());
			}

			if (type !== 'layer') {
				$('.tool').css({'box-shadow': 'inset 0px 0px 0px 4px #fff'});
				for (var tool in this.state) {
					if (this.state[tool] === true) {
						isSelected = tool;
						$('.' + tool + 'Icon').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(110, 194, 179, 1)'});
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

		return (
			<div className={toolBox}>
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
				<div id="Select Point"
					onClick={(e) => this.handleClick(e, 'select')}
					className={selectIcon}>
				</div>
				<div id="Select Figure"
					onClick={(e) => this.handleClick(e, 'selectAll')}
					className={selectAllIcon}>
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
				<div id="Save Workspace"
					onDoubleClick={(e) => this.handleDoubleClick(e, 'workspace')}
					onClick={(e) => this.handleClick(e, 'workspace')}
					className={workspaceIcon}>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {

	console.log('state', state)

	return {
		tool: state.clickareas.tool,
		currentView: state.clickareas.currentView,
		initLayer: state.clickareas.initLayer,
		workspace: state.clickareas.workspace
	};
};

export default connect(mapStateToProps)(Toolbox);
