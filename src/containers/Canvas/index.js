import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import VectorDrawer from '../../components/Clickarea/VectorDrawer';
import { updateClickarea, removeClickarea, makeClickarea } from '../../actions/clickarea';
import styles from './styles/styles.css';

export default class Canvas extends Component {

	constructor (props) {
		super (props);

		this.state = {
			views: {},
			fill: false,
			currentView: null,
			noItems: 0,
			backgroundImg: null
		}
	}

	componentDidMount () {
		this.vectorDrawer = new VectorDrawer(
			this.refs.svgWrapper,
			updateClickarea,
			removeClickarea,
			this.props.dispatch
		);

		this.vectorDrawer.update(this.state);
	}

	componentDidUpdate (prevProps) {
		if (Object.keys(this.state.views).length > 0) {
			this.vectorDrawer.update(this.state);
		}
	}

	componentWillReceiveProps (nextProps) {
		this.state.views = nextProps.clickareas.views;
		this.state.fill = nextProps.clickareas.fill;

		const objLength = Object.keys(nextProps.clickareas.views);

		if (nextProps.clickareas.isNew == true) {
			this.setCurrentScene(nextProps, objLength);
			this.props.dispatch(makeClickarea(nextProps.clickarea, this.state.currentView));
			this.openClickarea();
		}

		console.log('baaaaaaaar')


		this.state.currentView = nextProps.clickareas.views[objLength].viewId;

		if (typeof this.props.clickareas.isNew != undefined) {
			$('#createForm').show();
		}
	}

	setCurrentScene (nextProps, objLength) {
		this.vectorDrawer.state.currentView = nextProps.clickareas.views[objLength].viewId;
		this.vectorDrawer.state.views.push(this.vectorDrawer.state.currentView);
		this.state.backgroundImg = nextProps.clickareas.views[this.state.currentView].image;
	}

	openClickarea () {
		this.vectorDrawer.settings.initRectFade = false;

		if (this.vectorDrawer.state.nodes.length == 0 ||
			this.vectorDrawer.state.allowedToCreateNew == true) {
			this.vectorDrawer.animateNewClickarea(80, 0, 1500, 250,
				'bounce', this.vectorDrawer.createClickarea);
		}
	}

	render () {

		var backgroundImg;



		if (Object.keys(this.props.clickareas.views).length) {
			backgroundImg = require('../../images/' + this.props.clickareas.views[this.state.currentView].image);
		}

		return (
			<div ref='svgWrapper'>
				<img className="canvasIcon" src={backgroundImg} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		clickareas: state.clickareas,
		clickarea: state.clickareas.clickarea
	}
}

export default connect(mapStateToProps)(Canvas);
