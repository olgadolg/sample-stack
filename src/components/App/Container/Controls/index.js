import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import Checkbox from '../Checkbox';
import CreateForm from './CreateForm';
import SceneList from './Scene/SceneList';
import Modal from '../Modal';
import styles from './styles/styles.css';
import checkboxStyles from '../Checkbox/styles/styles.css';
import { updateFill } from '../../../../actions/clickarea';

export default class ControlsContainer extends Component {

	constructor () {
		super();

		this.state = {
			fillChecked: false,
			isModalOpen: false
		};
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.clickareas.clickarea.coords !== null) {
			$('.lockFillWrapper').fadeIn();
		}

		this.setState({opacity: this.props.opacity});
	}

	fillChange () {
		this.props.dispatch(updateFill(!this.state.fillChecked));
		this.setState({fillChecked: !this.state.fillChecked});
	}

	openModal () {
		this.setState({ isModalOpen: true });
	}

	render () {
		const lockFillWrapper = classnames({
			'lockFillWrapper': true,
			[styles.lockFillWrapper]: true
		});

		const labelClass = classnames({
			'checkboxLabel': true,
			[checkboxStyles.checkboxLabel]: true
		});

		return (
			<div className={styles.controlsContainer} >
				<div className={lockFillWrapper}>
					<Checkbox
						labelClass={labelClass}
						onChange={this.fillChange.bind(this)}
						checked={this.state.fillChecked}
						label="Apply color"
					/>
				</div>
				<SceneList />
				<CreateForm />
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
