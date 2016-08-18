import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import Controls from './Controls';
import $ from 'jquery';
import Canvas from './Canvas';
import Modal from './Modal';
import { loadWorkspace } from '../../../actions/workspace';
import { loadArtboard } from '../../../actions/artboard';
import styles from './styles/styles.css';

export default class Container extends Component {

	componentDidMount () {
		this.props.dispatch(loadArtboard(this.props.clickareas, false));
		this.props.dispatch(loadWorkspace(this.props.workspace, false, true));
		$('.wrapper').hide();
	}

	componentWillReceiveProps (nextProps) {
		let header = document.getElementById('header');
		let controls = document.getElementById('controlsContainer');
		let canvas = document.getElementById('canvasWrapper');

		if (nextProps.onload === true && nextProps.init === false) {
			if (!isNaN(nextProps.workspace.header.y)) {
				header.style.top = nextProps.workspace.header.y + 'px';
			}
			if (!isNaN(nextProps.workspace.header.x)) {
				header.style.left = nextProps.workspace.header.x + 'px';
			}
			if (!isNaN(nextProps.workspace.controlsContainer.y)) {
				controls.style.top = nextProps.workspace.controlsContainer.y + 'px';
			}
			if (!isNaN(nextProps.workspace.controlsContainer.x)) {
				controls.style.left = nextProps.workspace.controlsContainer.x + 'px';
			}

			if (!isNaN(nextProps.workspace.canvasWrapper.y)) {
				canvas.style.top = nextProps.workspace.canvasWrapper.y + 'px';
			}

			if (!isNaN(nextProps.workspace.canvasWrapper.x)) {
				canvas.style.left = nextProps.workspace.canvasWrapper.x + 'px';
			}

			$('.wrapper').show();
		} else if (nextProps.init === true) {
			$('.wrapper').show();
		}
	}

	render () {
		return (
			<div className="wrapper">
				<Modal />
				<Header />
				<Controls />
				<Canvas />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		clickareas: state.clickareas,
		views: state.views,
		workspace: state.clickareas.workspace,
		loadWorkspace: state.clickareas.loadWorkspace,
		onload: state.clickareas.onload,
		init: state.clickareas.init,
		reset: state.clickareas.reset
	};
};

export default connect(mapStateToProps)(Container);
