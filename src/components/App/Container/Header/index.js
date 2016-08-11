import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Toolbox from '../Tools';
import { SliderPicker } from 'react-color';
import { selectColor } from '../../../../actions/controls';
import { saveWorkspace, removeColor } from '../../../../actions/clickarea';
import Draggable, {DraggableCore} from 'react-draggable';
import styles from './styles/styles.css';

export default class Header extends Component {

	constructor () {
		super();

		this.state = {
			color: '#6ec2b3'
		};

		this.handleRemoveColor = this.handleRemoveColor.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.onStart = this.onStart.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
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
		this.setState({
			color: event.hex
		});
		this.props.dispatch(selectColor(event));
	}

	onStart () {
		let header = document.getElementById('header');
		let controlsContainer = document.getElementById('controlsContainer');
		let canvasWrapper = document.getElementById('canvasWrapper');
		header.style.zIndex = '99999999';
		controlsContainer.style.zIndex = '9';
		canvasWrapper.style.zIndex = '9';
	}

	handleDrag (e, ui) {
		let element = {
			name: ui.node.id,
			x: e.clientX,
			y: e.clientY
		};

		this.props.dispatch(saveWorkspace(element));
	}

	render () {
		const dragHandlers = {onStart: this.onStart};
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

		const selectedTool = classnames({
			'selectedTool': true,
			[styles.selectedTool]: true
		});

		return (
			<Draggable onDrag={this.handleDrag} {...dragHandlers}>
				<header id="header" className={styles.header}>
					<img src={logo} alt="logo" />
					<Toolbox />
					<div className={tooldescWrapper}>
						<p>
							<span id="selectedtool" className={selectedTool}> Pen Tool</span>
						</p>
					</div>
					<div className={slider}>
						<SliderPicker
							color={this.state.color}
							onChange={this.handleColorChange}/>
					</div>
					<div onClick={(e) => this.handleRemoveColor(e, 'remove')} className={removeIcon}></div>
				</header>
			</Draggable>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		color: state.clickareas.color
	};
};
export default connect(mapStateToProps)(Header);
