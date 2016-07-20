import React, { Component } from 'react';
import { connect } from 'react-redux';
import VectorDrawer from '../../components/Clickarea/VectorDrawer';
import { updateClickarea, removeClickarea, makeClickarea } from '../../actions/clickarea';

export default class Canvas extends Component {

	constructor (props) {
		super(props);

		this.state = {
			views: {},
			fill: false,
			currentView: null,
			noItems: 0,
			backgroundImg: null
		};
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
		const views = nextProps.clickareas.views;
		const view = Object.keys(views);
		const index = view[view.length - 1];
		const currentView = nextProps.clickareas.currentView;
		const vectorState = this.vectorDrawer.state;

		this.setState({
			views: views,
			fill: nextProps.clickareas.fill,
			currentView: currentView,
			backgroundImg: views[views[index].viewId].image
		}, () => {
			if (nextProps.clickareas.isNew === true) {
				vectorState.currentView = views[index].viewId;
				vectorState.views.push(vectorState.currentView);
				this.props.dispatch(makeClickarea(nextProps.clickarea, this.state.currentView));
				this.openClickarea(vectorState);
			}

			if (typeof this.props.clickareas.isNew !== undefined) {
				const form = document.getElementById('createForm');
				form.style.display = 'block';
			}
		});
	}

	openClickarea (vectorState) {
		this.vectorDrawer.settings.initRectFade = false;

		if (vectorState.nodes.length === 0 ||
			vectorState.allowedToCreateNew === true) {
			this.vectorDrawer.animateNewClickarea(80, 0, 1500, 250,
				'bounce', this.vectorDrawer.createClickarea);
		}
	}

	render () {
		let backgroundImg;

		if (Object.keys(this.props.clickareas.views).length) {
			backgroundImg = require('../../images/' + this.state.currentView);
		}

		return (
			<div ref="svgWrapper">
				<img className="canvasIcon" src={backgroundImg} />
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		clickareas: state.clickareas,
		clickarea: state.clickareas.clickarea
	};
};

export default connect(mapStateToProps)(Canvas);
