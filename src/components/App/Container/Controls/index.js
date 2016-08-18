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
			json: ''
		};

		this.utilities = new Utilities();
		this.saveProject = this.saveProject.bind(this);
		this.loadProject = this.loadProject.bind(this);
		this.exportProject = this.exportProject.bind(this);
		this.onStop = this.onStop.bind(this);
		this.onStart = this.onStart.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemoveColor = this.handleRemoveColor.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
	}

	componentDidMount () {
		$('input[type="file"]').attr('title', window.webkitURL ? ' ' : '');
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.clickareas.clickarea.coords !== null) {
			$('.lockFillWrapper').fadeIn();
		}

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

	exportProject () {
		let stateToExport = {
			clickareas: this.props.clickareas
		};

		this.props.dispatch(exportProject(stateToExport));
	}

	saveProject () {
		let stateToSave = {
			clickareas: this.props.clickareas
		};

		this.props.dispatch(save(stateToSave));
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

	handleRemoveColor (event) {
		this.props.dispatch(removeColor());
	}

	handleColorChange (event) {
		this.setState({color: event.hex});
		this.props.dispatch(selectColor(event));
	}

	render () {
		const nAngle = classnames({
			'nAngle': true,
			[styles.nAngle]: true
		});

		const slider = classnames({
			'color-slider': true,
			[styles.colorSlider]: true
		});

		const textfieldClass = classnames({
			'textfield': true,
			[styles.textfield]: true
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

		const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
		const btnStyle = { backgroundColor: '#E90086' };

		const titleLabel = classnames({
			'titleLabel': true,
			[styles.titleLabel]: true
		});

		/*
		<input
			type="file"
			name="file"
			id="file"
			onChange={(e) => this.loadProject(e)}
			className={styles.inputfile}
		/>
		<label for="file">Load Project</label>
		<Button onClick={this.saveProject} label="Save Project" />
		<Button onClick={this.exportProject} btnStyle={btnStyle} label="Export Project" />
		*/

		return (
			<Draggable cancel=".color-slider, .tool, .logo, .removeIcon, .nAngle" {...dragHandlers}>
				<div id="controlsContainer" className={styles.controlsContainer} >
					<Title />
					<label className={titleLabel}>Rotation</label>
					<form className={rotateForm}>
						<input defaultvalue="0"
							className={textfieldClass}
							onChange={this.onChange}
							onMouseUp={this.onMouseUp}
						 	type="text"
							value={this.state.value}
							id="nAngle"
						/>
						<button className={button} onClick={this.handleSubmit}>Rotate Figure</button>
					</form>
					<label className={titleLabel}>Color</label>
					<div className={slider}>
						<SliderPicker
							color={this.state.color}
							onChange={this.handleColorChange}/>
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
