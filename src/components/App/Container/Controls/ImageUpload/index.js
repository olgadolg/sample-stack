import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { uploadImage } from '../../../../../actions/imageupload';
import styles from './styles/styles.css';

export default class ImageUpload extends Component {

	constructor () {
		super();

		this.state = {
			files: null
		};
	}

	handleDrop (files) {
		this.setState({
			files: files
		});

		this.props.dispatch(uploadImage(files));
	}

	render () {
		return (
			<div>
				<Dropzone
					className={styles.dropzone}
					activeClassName={styles.activeDropzone}
					ref="dropzone"
					onDrop={this.handleDrop.bind(this)}>
					<div className={styles.dropText}>Drop image here to create a new view</div>
				</Dropzone>
			</div>
		);
	}
}

export default connect()(ImageUpload);
