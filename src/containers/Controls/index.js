import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FillToggler from '../../components/clickarea/FillToggler';
import CreateForm from '../../components/clickarea/CreateForm';
import styles from './styles/styles.css';

export default class ControlsContainer extends Component {

	constructor(props) {
		super(props);
		
	}

	render() {
		const controlsContainer = classnames({
			'controlsContainer': true,
			[styles.controlsContainer]: true
		});

		return (
			<div className={styles.controlsContainer} >
				<FillToggler />
				<CreateForm />
			</div>
		);
	}
}

export default connect()(ControlsContainer);