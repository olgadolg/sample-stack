import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import Button from '../Button';
import Title from '../Title';
import List from '../List';
import styles from './styles/styles.css';
import { updateFill } from '../../../../actions/clickarea';
import Draggable, {DraggableCore} from 'react-draggable';
import { exportProject, save, load } from '../../../../actions/project';

export default class ControlsContainer extends Component {

	constructor () {
		super();

		this.state = {
			fillChecked: false,
			isModalOpen: false,
			json: ''
		};

		this.saveProject = this.saveProject.bind(this);
		this.loadProject = this.loadProject.bind(this);
		this.exportProject = this.exportProject.bind(this);
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
	}

	render () {
		const dragHandlers = {onStart: this.onStart};
		const btnStyle = {
			backgroundColor: '#E90086'
		};

		return (
			<Draggable zIndex={9999999} {...dragHandlers}>
				<div id="controlsContainer" className={styles.controlsContainer} >
					<Title />
					<List />
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
				</div>
			</Draggable>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(ControlsContainer);
