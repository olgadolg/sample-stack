import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { initLayer } from '../../../../../actions/layer';
import styles from './styles/styles.css';

export default class ImageUpload extends Component {

	constructor () {
		super();

		this.state = {
			fileData: null,
			name: null,
			currentView: null
		};
	}

	componentWillReceiveProps (nextProps) {
		this.setState({ currentView: nextProps.currentView });
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
					console.log('state', this.state);
					this.props.dispatch(initLayer(this.state));
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
					<div className={styles.dropText}>Drop image to create a new view layer</div>
				</Dropzone>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		currentView: state.clickareas.currentView
	};
};

export default connect(mapStateToProps)(ImageUpload);
