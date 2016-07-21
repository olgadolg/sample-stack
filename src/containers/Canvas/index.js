import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import VectorDrawer from '../../components/Clickarea/VectorDrawer';
import { updateClickarea, removeClickarea, makeClickarea } from '../../actions/clickarea';
import { selectViewUpdate } from '../../actions/views';

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
		this.vectorDrawer.update(this.state);
	}

	componentWillReceiveProps (nextProps) {
		const views = nextProps.clickareas.views;
		const view = Object.keys(views);
		const index = view[view.length - 1];
		const currentView = nextProps.clickareas.currentView;
		const vectorState = this.vectorDrawer.state;

		//console.log('what is return', nextProps.clickareas.views[nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1')].nodes)

		//this.vectorDrawer.state.nodes = nextProps.clickareas.views[nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1')].nodes;
		//this.vectorDrawer.state.edges = nextProps.clickareas.views[nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1')].edges;
		//this.vectorDrawer.populatedContainerCreator();

		if (nextProps.clickareas.viewUpdate == true) {

			// updatera rätt vy med noder/edges
			// hämta noder/edges från andra vyn

			this.props.dispatch(selectViewUpdate(
				nextProps.clickareas.currentView
			));

			console.log('??????', nextProps.clickareas.currentView);


		}


		if (nextProps.clickareas.viewUpdate == true || this.state.currentView != null && this.props.clickareas.currentView !== nextProps.clickareas.currentView) {


			this.vectorDrawer = new VectorDrawer(
				this.refs.svgWrapper,
				updateClickarea,
				removeClickarea,
				this.props.dispatch
			);

			this.vectorDrawer.state.nodes = nextProps.clickareas.views[nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1')].nodes;
			this.vectorDrawer.state.edges = nextProps.clickareas.views[nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1')].edges;
			//this.vectorDrawer.populatedContainerCreator();

			console.log('nodes', this.vectorDrawer.state.nodes)

			console.log('herrrrreeeee', nextProps.clickareas.views[nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1')])



			console.log('nodes', this.vectorDrawer.state.nodes, 'edges', this.vectorDrawer.state.edges)

			this.vectorDrawer.update();
		}

		this.setState({
			views: views,
			fill: nextProps.clickareas.fill,
			nodes: this.vectorDrawer.state.nodes,
			edges: this.vectorDrawer.state.edges,
			currentView: currentView,
			backgroundImg: nextProps.clickareas.views[nextProps.clickareas.currentView]
		}, () => {
			if (nextProps.clickareas.isNew === true) {

				console.log('istrue')

				vectorState.currentView = views[index].viewId;
				vectorState.views.push(vectorState.currentView);
				this.props.dispatch(makeClickarea(
					nextProps.clickarea,
					this.state.currentView,
					vectorState.nodes,
					vectorState.edges
				));
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

		//if (vectorState.allowedToCreateNew === true) {
			this.vectorDrawer.animateNewClickarea(80, 0, 1500, 250,
				'bounce', this.vectorDrawer.createClickarea);
		//}
	}

	render () {
		let backgroundImg;

		console.log('currentview', this.state.currentView)

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
