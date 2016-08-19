import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Toolbox from '../Tools';
import { selectColor } from '../../../../actions/controls';
import { removeColor } from '../../../../actions/clickarea';
import { saveWorkspace } from '../../../../actions/workspace';
import { selectTool } from '../../../../actions/controls';
import Draggable from 'react-draggable';
import Utilities from '../../../../Utilities';
import styles from './styles/styles.css';

export default class Header extends Component {

	constructor () {
		super();

		this.state = {
			color: '#6ec2b3',
			value: 0
		};

		this.utilities = new Utilities();

		this.loadProject = this.loadProject.bind(this);
		this.handleRemoveColor = this.handleRemoveColor.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.onStart = this.onStart.bind(this);
		this.onStop = this.onStop.bind(this);
		this.onDrag = this.onDrag.bind(this);
	}

	componentWillReceiveProps (newProps) {
		this.setState({
			color: newProps.color
		});
	}

	handleRemoveColor (event) {
		this.props.dispatch(removeColor());
	}

	handleColorChange (event) {
		this.setState({color: event.hex});
		this.props.dispatch(selectColor(event));
	}

	onDrag (e, ui) {
		const {x, y} = this.state;

		if (e.target.id === 'header') {
			this.setState({
				x: x + ui.deltaX,
				y: y + ui.deltaY
			});
		}
	}

	onStart (e, ui) {
		let header = document.getElementById('header');
		let controlsContainer = document.getElementById('controlsContainer');
		let canvasWrapper = document.getElementById('canvasWrapper');
		header.style.zIndex = '99999999';
		controlsContainer.style.zIndex = '9';
		canvasWrapper.style.zIndex = '9';
		this.props.dispatch(selectTool('selectAll'));
	}

	onStop (e, ui) {
		if (e.target.id === 'Save Workspace') {
			return;
		}

		const el = document.getElementById('header');
		const position = this.utilities.createPosition(ui, this.props, el);
		this.props.dispatch(saveWorkspace(position));
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
					this.props.dispatch(load(object));
				});
			};
		})(file);
	}

	render () {
		const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
		const logo = require('../../../../images/logo.png');

		const slider = classnames({
			'color-slider': true,
			[styles.colorSlider]: true
		});

		const removeIcon = classnames({
			'removeIcon': true,
			[styles.removeIcon]: true
		});

		const tooldescWrapper = classnames({
			'tooldescWrapper': true,
			[styles.tooldescWrapper]: true
		});

		const selectedToolName = classnames({
			'selectedToolName': true,
			[styles.selectedToolName]: true
		});

		const selectedToolNameWrapper = classnames({
			'selectedToolNameWrapper': true,
			[styles.selectedToolNameWrapper]: true
		});

		return (
			<Draggable cancel=".color-slider, .tool, .logo, .removeIcon, .nAngle" onDrag={this.onDrag} {...dragHandlers}>
				<header id="header" className={styles.header}>
					<img className="logo" src={logo} alt="logo" />

					<Toolbox />
				</header>
			</Draggable>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		color: state.clickareas.color,
		workspace: state.clickareas.workspace
	};
};
export default connect(mapStateToProps)(Header);
