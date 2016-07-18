import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import VectorDrawer from '../../components/Clickarea/VectorDrawer';
import { updateClickarea, removeClickarea } from '../../actions/clickarea';
import styles from './styles/styles.css';
import backgroundImage from '../../images/3-1.jpg'

export default class Canvas extends Component {

	constructor(props) {
		super(props);

		this.state = {
			views: {},
			fill: false
		}
	}

	componentDidMount() {
		this.vectorDrawer = new VectorDrawer(
			this.refs.svgWrapper,
			updateClickarea,
			removeClickarea,
			this.props.dispatch
		);

		this.vectorDrawer.update(this.state);
	}

	componentDidUpdate(prevProps) {
		if (Object.keys(this.state.views).length > 0) {
			this.vectorDrawer.update(this.state);
		}
	}

	componentWillReceiveProps(nextProps) {
		this.state.views = nextProps.clickareas.views;
		this.state.fill = nextProps.clickareas.fill;

		if (Object.keys(this.props.clickareas.views).length !==
			Object.keys(this.state.views).length &&
			Object.keys(this.state.views).length > 0) {
			
			this.openClickarea();
		}

		if (Object.keys(nextProps.clickareas.views).length > 0) {
			this.vectorDrawer.update(this.state);
		}
	}

	openClickarea() {
		this.vectorDrawer.settings.initRectFade = false;

		if (this.vectorDrawer.state.nodes.length == 0 ||
			this.vectorDrawer.state.allowedToCreateNew == true) {
			this.vectorDrawer.animateNewClickarea(80, 0, 1500, 250, 
				'bounce', this.vectorDrawer.createClickarea);
		}
	}

	render() {
		return (
			<div ref='svgWrapper'>
				<img src={backgroundImage} alt="background" />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({ clickareas: state.clickareas })
export default connect(mapStateToProps)(Canvas);