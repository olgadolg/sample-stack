import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import styles from './styles/styles.css';
import { selectTool } from '../../../../actions/controls';
import { pasteClickarea, cutClickarea, unselectClickarea, getCopy } from '../../../../actions/clickarea';
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
	}

	componentWillReceiveProps (nextProps) {
		this.setState({currentView: nextProps.currentView});

		if (nextProps.initLayer === true) {
			let selectedtool = document.getElementById('selectedtool');
			this.setState({tool: 'Pen Tool'});
			selectedtool.innerHTML = 'Pen Tool';
		}

		if (nextProps.currentView.indexOf('Layer') > -1) {
			$('.layerIcon').css({
				'pointer-events': 'none',
				'opacity': '0.5'
			});
		} else {
			$('.layerIcon').css({
				'pointer-events': 'all',
				'opacity': '1'
			});
		}

		if (nextProps.tool !== 'layer' && typeof nextProps.tool !== 'undefined') {
			$('.tool').css({'box-shadow': 'inset 0px 0px 0px 4px #fff'});
			$('.tool:hover').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(110, 194, 179, 1)'});
			$('.' + nextProps.tool + 'Icon').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(110, 194, 179, 1)'});
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

	handleClick (event, type) {
		var obj = {};

		$('.handle').removeClass('selected');

		for (var item in this.state) {
			if (type === item) {
				obj[type] = true;
			} else if (item !== 'currentView') {
				obj[item] = false;
			}
		}

		obj.tool = event.target.id;

		if (type === 'copy') {
			this.props.dispatch(getCopy());
		}

		if (type === 'cut') {
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
				$('.tool').css({'box-shadow': 'inset 0px 0px 0px 4px #fff'});
				$('.tool:hover').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(110, 194, 179, 1)'});
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
					onMouseEnter={(e) => this.handleMouseEnter(e, 'Pen Tool')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'pen')}
					className={penIcon}>
				</div>
				<div id="Add Point"
					onMouseEnter={(e) => this.handleMouseEnter(e, 'Add Point')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'penAdd')}
					className={penAddIcon}>
				</div>
				<div id="Remove Point"
					onMouseEnter={(e) => this.handleMouseEnter(e, 'Remove Point')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'penRemove')}
					className={penRemoveIcon}>
				</div>
				<div id="Select"
					onMouseEnter={(e) => this.handleMouseEnter(e, 'Select')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'select')}
					className={selectIcon}>
				</div>
				<div id="Select All"
					onMouseEnter={(e) => this.handleMouseEnter(e, 'Select All')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'selectAll')}
					className={selectAllIcon}>
				</div>
				<div id="Copy Figure"
					onMouseEnter={(e) => this.handleMouseEnter(e, 'Copy Figure')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'copy')}
					className={copyIcon}>
				</div>
				<div id="Cut / Paste"
					onMouseEnter={(e) => this.handleMouseEnter(e, 'Cut / Paste')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'cut')}
					className={cutIcon}>
				</div>
				<div id="New Layer"
					onMouseEnter={(e) => this.handleMouseEnter(e, 'New Layer')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'layer')}
					className={layerIcon}>
				</div>
				<div id="Save Workspace"
					onMouseEnter={(e) => this.handleMouseEnter(e, 'Save Workspace')}
					onMouseLeave={this.handleMouseLeave}
					onClick={(e) => this.handleClick(e, 'workspace')}
					className={workspaceIcon}>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		tool: state.clickareas.tool,
		currentView: state.clickareas.currentView,
		initLayer: state.clickareas.initLayer
	};
};

export default connect(mapStateToProps)(Toolbox);
