import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { uploadImage } from '../../actions/imageupload';

export default class ImageUpload extends Component {

	constructor() {
		super();

		this.state = {
			files: null
		}
	}

	handleDrop(files) {
		this.setState({
			files: files
		});

		this.props.dispatch(uploadImage(files));
	}

	render() {
		return (
			<div>
				<Dropzone ref="dropzone" onDrop={this.handleDrop.bind(this)} >
					<div>Try dropping some files here, or click to select files to upload.</div>
				</Dropzone>
				<button type="button" onClick={this.onOpenClick}>Open Dropzone</button>
			</div>
		);
	}
}

export default connect()(ImageUpload);