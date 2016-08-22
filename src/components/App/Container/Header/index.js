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
		this.onStart = this.onStart.bind(this);
		this.onStop = this.onStop.bind(this);
		this.onDrag = this.onDrag.bind(this);
	}

	componentWillReceiveProps (newProps) {
		this.setState({
			color: newProps.color
		});
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

		if (position.x === 0 && position.y === 0) {
			return;
		}

		this.props.dispatch(saveWorkspace(position));
	}

	render () {
		const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
		const logo = require('../../../../images/logo.png');

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
