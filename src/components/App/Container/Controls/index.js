import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import Button from '../Button';
import Title from '../Title';
import Layers from '../Layers/List';
import Modal from '../Modal';
import styles from './styles/styles.css';
import { updateFill } from '../../../../actions/clickarea';
import { saveProject } from '../../../../actions/file';


export default class ControlsContainer extends Component {

	constructor () {
		super();

		this.state = {
			fillChecked: false,
			isModalOpen: false
		};

		this.saveProject = this.saveProject.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.clickareas.clickarea.coords !== null) {
			$('.lockFillWrapper').fadeIn();
		}

		this.setState({opacity: this.props.opacity});
	}

	saveProject () {
		let stateToSave = {
			controls: this.props.controls,
			clickareas: this.props.clickareas
		};

		this.props.dispatch(saveProject(stateToSave));
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
				<Button label="Load Project" />
				<Button onClick={this.saveProject} label="Save Project" />
				<Button btnStyle={btnStyle} label="Export Project" />
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
