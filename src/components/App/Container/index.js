import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import Controls from './Controls';
import $ from 'jquery';
import Canvas from './Canvas';
import Modal from './Modal';
import { loadWorkspace, init } from '../../../actions/clickarea';
import styles from './styles/styles.css';

export default class Container extends Component {

	componentDidMount () {
		this.props.dispatch(loadWorkspace(this.props.workspace, false, true));
		$('.wrapper').hide();
		$('.header').hide();
	}

	componentWillReceiveProps (nextProps) {
		let wrapper = document.getElementsByClassName('wrapper')[0];
		let header = document.getElementById('header');
		let controls = document.getElementById('controlsContainer');
		let canvas = document.getElementById('canvasWrapper');

		if (nextProps.onload === true && nextProps.init === false) {
			header.style.top = nextProps.workspace.header.y + 'px';
			header.style.left = nextProps.workspace.header.x + 'px';
			controls.style.top = nextProps.workspace.controlsContainer.y + 'px';
			controls.style.left = nextProps.workspace.controlsContainer.x + 'px';
			canvas.style.top = nextProps.workspace.canvasWrapper.y + 'px';
			canvas.style.left = nextProps.workspace.canvasWrapper.x + 'px';
			wrapper.style.display = '';

			$('.wrapper').show();
		} else if (nextProps.init === true) {
			console.log('here....')
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
		state: state,
		workspace: state.clickareas.workspace,
		loadWorkspace: state.clickareas.loadWorkspace,
		onload: state.clickareas.onload,
		init: state.clickareas.init
	};
};

export default connect(mapStateToProps)(Container);
