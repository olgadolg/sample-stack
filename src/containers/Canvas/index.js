import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import VectorDrawer from '../../components/Clickarea/VectorDrawer';
import styles from './styles/styles.css';
import backgroundImage from '../../images/3-1.jpg'

export default class Canvas extends Component {

	constructor(props) {
		super(props);

		this.state = {
			list: {},
			fill: false
		}
	}

	componentDidMount() {
		this.vectorDrawer = new VectorDrawer(this.refs.svgWrapper, this.createClickarea);
		this.vectorDrawer.update(this.state);
	}

	componentDidUpdate(prevProps) {
		this.vectorDrawer.update(this.state);
	}

	componentWillReceiveProps(nextProps) {
		this.state.list = nextProps.clickareas.list;
		this.state.fill = nextProps.clickareas.fill;

		if (Object.keys(this.props.clickareas.list).length !== Object.keys(this.state.list).length) {
			this.openClickarea();
		}

		this.vectorDrawer.update(this.state);
	}

	openClickarea() {
		this.vectorDrawer.settings.initRectFade = false;

		if (this.vectorDrawer.state.nodes.length == 0 ||
			this.vectorDrawer.state.allowedToCreateNew == true) {
			this.vectorDrawer.animateNewClickarea(80, 0, 1500, 250, 'bounce',this.vectorDrawer.createClickarea);
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

const mapStateToProps = (state) => ({clickareas: state.clickarea})
export default connect(mapStateToProps)(Canvas);