import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import VectorDrawer from '../../components/Clickarea/VectorDrawer';
import styles from './styles/styles.css';
import backgroundImage from '../../images/3-1.jpg'

export default class Canvas extends Component {

	constructor(props) {
		super(props);

		this.state = {
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
		if (nextProps.clickareas != this.props.clickareas) {
			this.openClickarea();
		}

		this.setState({
			fill: nextProps.fill
		});

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

const mapStateToProps = (state) => {
	return {
		clickareas: state.clickarea.list,
		fill: state.clickarea.fill
	}
}

export default connect(mapStateToProps)(Canvas);