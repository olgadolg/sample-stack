import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import Button from '../Button';
import classnames from 'classnames';
import Title from '../Title';
import List from '../List';
import styles from './styles/styles.css';
import { updateFill } from '../../../../actions/clickarea';
import { saveWorkspace } from '../../../../actions/workspace';
import { selectTool } from '../../../../actions/controls';
import Utilities from '../../../../Utilities';
import { SliderPicker } from 'react-color';
import { selectColor } from '../../../../actions/controls';
import { removeColor } from '../../../../actions/clickarea';
import Draggable from 'react-draggable';
import { exportProject, save, load } from '../../../../actions/project';

export default class ControlsContainer extends Component {

	constructor () {
		super();

		this.state = {
			fillChecked: false,
			isModalOpen: false,
			value: 0,
			rangeValue: 70,
			json: ''
		};

		this.utilities = new Utilities();
		this.onStop = this.onStop.bind(this);
		this.onStart = this.onStart.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemoveColor = this.handleRemoveColor.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.onRangeChange = this.onRangeChange.bind(this);
	}

	componentDidMount () {
		$('input[type="file"]').attr('title', window.webkitURL ? ' ' : '');
	}

	componentWillReceiveProps (nextProps) {
		//if (nextProps.clickareas.clickarea.coords !== null) {
			//$('.lockFillWrapper').fadeIn();
		//}

		this.setState({opacity: this.props.opacity});
	}

	handleSubmit (e) {
		e.preventDefault();
		this.setState({
			value: 0
		});
	}

	onChange (e) {
		this.setState({
			value: e.target.value
		});
	}

	fillChange () {
		this.props.dispatch(updateFill(!this.state.fillChecked));
		this.setState({fillChecked: !this.state.fillChecked});
	}

	openModal () {
		this.setState({ isModalOpen: true });
	}

	onStart () {
		let controlsContainer = document.getElementById('controlsContainer');
		let header = document.getElementById('header');
		let canvasWrapper = document.getElementById('canvasWrapper');
		controlsContainer.style.zIndex = '99999999';
		canvasWrapper.style.zIndex = '9';
		header.style.zIndex = '9';
		this.props.dispatch(selectTool('selectAll'));
	}

	onStop (e, ui) {
		if (e.target.id === 'Save Workspace') {
			return;
		}

		const el = document.getElementById('controlsContainer');
		const position = this.utilities.createPosition(ui, this.props, el);
		this.props.dispatch(saveWorkspace(position));
	}

	onRangeChange (e) {
		$('.clickarea').css('fill-opacity', e.target.value / 100);
		$('.rangeOutput').html(e.target.value / 100);
		this.setState({ rangeValue: e.target.value });
	}

	handleRemoveColor (event) {
		this.props.dispatch(removeColor());
	}

	handleColorChange (event) {
		this.setState({color: event.hex});
		this.props.dispatch(selectColor(event));
	}

	render () {
		const dragHandlers = {onStart: this.onStart, onStop: this.onStop};

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
			<Draggable cancel=".color-slider, .tool, .logo, .removeIcon, .nAngle, #weight" {...dragHandlers}>
				<div id="controlsContainer" className={styles.controlsContainer} >
					<Title />
					<label className={titleLabel}>Rotation</label>
					<form className={rotateForm}>
						<div className={rotateWrapper}>
							<input defaultvalue="0"
								className={textfieldClass}
								onChange={this.onChange}
								onMouseUp={this.onMouseUp}
							 	type="text"
								value={this.state.value}
								id="nAngle"
							/>
							<span className={degrees}>°</span>
						</div>
						<button className={button} onClick={this.handleSubmit}>Rotate Figure</button>
					</form>
					<label className={titleLabel}>Color</label>
					<div className={slider}>
						<SliderPicker
							color={this.state.color}
							onChange={this.handleColorChange}/>
						<div onClick={(e) => this.handleRemoveColor(e, 'remove')} className={removeIcon}></div>
					</div>
					<label className={titleLabel}>Opacity:</label>
					<div className={rangeWrapper}>
						<input
							className={inputRange}
							type="range"
							id="weight"
							min="0"
							onChange={this.onRangeChange}
							value={this.state.rangeValue}
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
