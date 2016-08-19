import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import styles from './styles/styles.css';
import { addLayer } from '../../actions/layer';
import { unselectClickarea } from '../../actions/clickarea';

export class App extends Component {

	constructor () {
		super();

		this.toggleTools = this.toggleTools.bind(this);
		this.toggleSettings = this.toggleSettings.bind(this);
		this.addLayer = this.addLayer.bind(this);
	}

	toggleTools () {
		if ($('#header').is(':visible')) {
			$('#header').hide();
		} else {
			$('#header').show();
		}
	}

	toggleSettings () {
		if ($('#controlsContainer').is(':visible')) {
			$('#controlsContainer').hide();
		} else {
			$('#controlsContainer').show();
		}
	}

	addLayer () {
		$('.dropzone').show();
		this.props.dispatch(addLayer());
		this.props.dispatch(unselectClickarea());
	}

	render () {
		const toolsIcon = classnames({
			'toolsIcon': true,
			[styles.toolsIcon]: true
		});

		const settingsIcon = classnames({
			'settingsIcon': true,
			[styles.settingsIcon]: true
		});

		const layerIcon = classnames({
			'layerIcon': true,
			'appIcon': true,
			[styles.layerIcon]: true,
			[styles.appIcon]: true
		});

		return (
			<div>
				<div
					id="toolsIcon"
					className={toolsIcon}
					onClick={this.toggleTools}
				>
				</div>
				<div
					id="settingsIcon"
					className={settingsIcon}
					onClick={this.toggleSettings}
				>
				</div>
				<div
					id="layerIcon"
					className={layerIcon}
					onClick={this.addLayer}
				>
				</div>
				{this.props.children}
			</div>
		);
	}
}

App.propTypes = {
	children: PropTypes.object
};

export default connect()(App);
