import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import Button from '../Button';
import Title from '../Title';
import Layers from '../Layers/List';
import Modal from '../Modal';
import styles from './styles/styles.css';
import { updateFill } from '../../../../actions/clickarea';
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

	render () {
		const btnStyle = {
			backgroundColor: '#E90086'
		};

		return (
			<div className={styles.controlsContainer} >
				<Title />
				<Layers />
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
				<button className="openModal" onClick={this.openModal.bind(this)}>Open modal</button>
				<Modal isOpen={this.state.isModalOpen} transitionName="modal-anim">
					<h5>Please add a view before creating clickareas</h5>
					<button>Close modal</button>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(ControlsContainer);
