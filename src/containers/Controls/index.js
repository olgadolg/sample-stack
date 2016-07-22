import React, { Component } from 'react';
import { connect } from 'react-redux';
import FillToggler from '../../components/clickarea/FillToggler';
import CreateForm from '../../components/clickarea/CreateForm';
import ImageUpload from '../../components/ImageUpload';
import SceneList from '../../components/Scene/SceneList';
import styles from './styles/styles.css';

export default class ControlsContainer extends Component {

	render () {
		return (
			<div className={styles.controlsContainer} >
				<FillToggler />
				<ImageUpload />
				<SceneList />
				<CreateForm />
			</div>
		);
	}
}

export default connect()(ControlsContainer);
