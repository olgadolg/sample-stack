import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import classnames from 'classnames';
import Title from '../Title';
import List from '../List';
import styles from './styles/styles.css';
import { saveWorkspace } from '../../../../actions/workspace';
import { selectTool } from '../../../../actions/controls';
import Utilities from '../../../../Utilities';
import { SliderPicker } from 'react-color';
import { selectColor } from '../../../../actions/controls';
import { setOpacity, removeColor } from '../../../../actions/clickarea';
import Draggable from 'react-draggable';

export default class ControlsContainer extends Component {

	constructor () {
		super();

		this.state = {
			rotationAngle: 90,
			opacityValue: 70,
			rotationSpeed: 2000,
			color: 'rgb(64, 181, 191)'
		};

		this.utilities = new Utilities();
		this.onStop = this.onDragStop.bind(this);
		this.onDragStart = this.onDragStart.bind(this);
		this.onChangeRotationAngle = this.onChangeRotationAngle.bind(this);
		this.onRotateFigure = this.onRotateFigure.bind(this);
		this.onRemoveColor = this.onRemoveColor.bind(this);
		this.onColorChange = this.onColorChange.bind(this);
		this.onOpacityChange = this.onOpacityChange.bind(this);
		this.onChangeRotationSpeed = this.onChangeRotationSpeed.bind(this);
	}

	componentDidMount () {
		$('input[type="file"]').attr('title', window.webkitURL ? ' ' : '');
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			opacity: this.props.opacity,
			color: nextProps.color
		});
	}

	onRotateFigure (e) {
		e.preventDefault();
		this.setState({ rotationValue: 0, rotationSpeed: 0 });
	}

	onChangeRotationSpeed (e) {
		this.setState({ rotationSpeed: e.target.value * 1000 });
	}

	onChangeRotationAngle (e) {
		let angle = e.target.value;
		if (angle > 360) angle = 360;
		this.setState({
			rotationAngle: angle
		});
	}

	onDragStart () {
		this.props.dispatch(selectTool('selectAll'));
	}

	onDragStop (e, ui) {
		if (e.target.id === 'Save Workspace') {
			return;
		}

		const el = document.getElementById('controlsContainer');
		const position = this.utilities.createPosition(ui, this.props, el);

		if (position.x === 0 && position.y === 0) {
			return;
		}

		this.props.dispatch(saveWorkspace(position));
	}

	onOpacityChange (e) {
		$('.clickarea').css('fill-opacity', e.target.value / 100);
		$('.rangeOutput').html(e.target.value / 100);
		this.setState({ opacityValue: e.target.value });
		this.props.dispatch(setOpacity(e.target.value / 100));
	}

	onColorChange (event) {
		this.setState({color: event.hex});
		this.props.dispatch(selectColor(event));
	}

	onRemoveColor (event) {
		this.props.dispatch(removeColor());
	}

	render () {
		const dragHandlers = {onDragStart: this.onDragStart, onDragStop: this.onDragStop};

		const slider = classnames({
			'color-slider': true,
			[styles.colorSlider]: true
		});

		const textfieldClass = classnames({
			'textfield': true,
			'rotatefield': true,
			[styles.textfield]: true,
			[styles.rotatefield]: true
		});

		const button = classnames({
			'button': true,
			'rotateBtn': true,
			[styles.rotateBtn]: true
		});

		const rotateForm = classnames({
			'rotateForm': true,
			[styles.rotateForm]: true
		});

		const titleLabel = classnames({
			'titleLabel': true,
			[styles.titleLabel]: true
		});

		const removeIcon = classnames({
			'removeIcon': true,
			[styles.removeIcon]: true
		});

		const rotateWrapper = classnames({
			'rotateWrapper': true,
			[styles.rotateWrapper]: true
		});

		const speedWrapper = classnames({
			'speedWrapper': true,
			[styles.speedWrapper]: true
		});

		const speed = classnames({
			'speed': true,
			[styles.speed]: true
		});

		const degrees = classnames({
			'degrees': true,
			[styles.degrees]: true
		});

		const inputRange = classnames({
			'inputRange': true,
			[styles.inputRange]: true
		});

		const rangeWrapper = classnames({
			'rangeWrapper': true,
			[styles.rangeWrapper]: true
		});

		const rangeOutput = classnames({
			'rangeOutput': true,
			[styles.rangeOutput]: true
		});

		return (
			<Draggable cancel=".rotateForm, .color-slider, .tool, .logo, .removeIcon, .nAngle, #weight" {...dragHandlers}>
				<div id="controlsContainer" className={styles.controlsContainer} >
					<Title />
					<label id="angleLabel" className={titleLabel}>Angle</label>
					<label className={titleLabel}>Speed</label>
					<form className={rotateForm}>
						<div className={rotateWrapper}>
							<input defaultvalue="0"
								className={textfieldClass}
								onChange={this.onChangeRotationAngle}
								type="text"
								value={this.state.rotationAngle}
								id="nAngle"
							/>
							<span className={degrees}>°</span>
						</div>
						<div className={speedWrapper}>
							<input defaultvalue="0"
								className={textfieldClass}
								onChange={this.onChangeRotationSpeed}
								type="text"
								value={this.state.rotationSpeed / 1000}
								id="rotateSpeed"
							/>
							<span className={speed}>s</span>
						</div>
						<button
							className={button}
							onClick={this.onRotateFigure}>
							Rotate
						</button>
					</form>
					<label className={titleLabel}>Color</label>
					<div className={slider}>
						<SliderPicker
							color={this.state.color}
							onChange={this.onColorChange}/>
						<div
							onClick={(e) => this.onRemoveColor(e, 'remove')}
							className={removeIcon}
						>
						</div>
					</div>
					<label className={titleLabel}>Opacity:</label>
					<div className={rangeWrapper}>
						<input
							className={inputRange}
							type="range"
							id="weight"
							min="0"
							onChange={this.onOpacityChange}
							value={this.state.opacityValue}
							max="100"
							/>
						<span className={rangeOutput}>0.7</span>
					</div>
					<List />
				</div>
			</Draggable>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		clickareas: state.clickareas,
		color: state.clickareas.color,
		workspace: state.clickareas.workspace
	};
};

export default connect(mapStateToProps)(ControlsContainer);
