import React, { Component } from 'react';
import { connect } from 'react-redux';
import FillToggler from './FillToggler';
import CreateForm from './CreateForm';
import ImageUpload from './ImageUpload';
import SceneList from './Scene/SceneList';
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
