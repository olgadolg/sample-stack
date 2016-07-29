import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { uploadImage } from '../../../../../actions/imageupload';
import styles from './styles/styles.css';

export default class ImageUpload extends Component {

	constructor () {
		super();

		this.state = {
			fileData: null,
			name: null
		};
	}

	handleDrop (files) {

		let reader = new FileReader();
		let file = files[0];

		reader.onload = ((theFile) => {
			return (e) => {
				this.setState({
					fileData: e.target.result,
					name: theFile.name
				}, () => {
					console.log('state', this.state)
					this.props.dispatch(uploadImage(this.state));
				});
			};
		})(file);

		reader.readAsDataURL(file);
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
