import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import VectorDrawer from './VectorDrawer';
import { updateClickarea, removeClickarea, makeClickarea } from '../../../actions/clickarea';
import { selectViewUpdate } from '../../../actions/views';

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
		this.lib = new VectorDrawer(
			this.refs.svgWrapper,
			updateClickarea,
			removeClickarea,
			this.props.dispatch
		);

		this.lib.update(this.state);
	}

	componentDidUpdate (prevProps) {
		this.lib.update(this.state);
	}

	componentWillReceiveProps (nextProps) {
		const self = this;
		const views = nextProps.clickareas.views;
		const view = Object.keys(views);
		const index = view[view.length - 1];
		const currentView = nextProps.clickareas.currentView;
		const libState = this.lib.state;

		this.lib.state.isNew = nextProps.clickareas.isNew;

		if (nextProps.clickareas.viewUpdate === true) {
			this.props.dispatch(selectViewUpdate(
				nextProps.clickareas.currentView
			));
		}

		this.setState({
			views: views,
			fill: nextProps.clickareas.fill,
			nodes: this.lib.state.nodes,
			edges: this.lib.state.edges,
			currentView: currentView,
			backgroundImg: nextProps.clickareas.views[nextProps.clickareas.currentView]
		}, () => {
			if (nextProps.clickareas.viewUpdate === true || this.state.currentView !== null && this.props.clickareas.currentView !== nextProps.clickareas.currentView) {
				this.lib = new VectorDrawer(
					this.refs.svgWrapper,
					updateClickarea,
					removeClickarea,
					this.props.dispatch
				);

				$('.canvasIcon').attr('src', require('../../../images/' + self.state.currentView));
				this.lib.state.nodes = nextProps.clickareas.views[nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1')].nodes;
				this.lib.state.edges = nextProps.clickareas.views[nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1')].edges;
				this.lib.state.currentView = nextProps.clickareas.currentView.replace(/(.*)\.(.*?)$/, '$1');
				this.lib.state.props = nextProps.clickareas;
				this.lib.update();
			}

			if (nextProps.clickareas.isNew === true) {
				libState.currentView = views[index].viewId;
				libState.views.push(libState.currentView);
				this.props.dispatch(makeClickarea(
					nextProps.clickarea,
					this.state.currentView,
					libState.nodes,
					libState.edges
				));
				this.openClickarea(libState);
			}

			if (typeof this.props.clickareas.isNew !== undefined) {
				const form = document.getElementById('createForm');
				form.style.display = 'block';
			}
		});
	}

	openClickarea (libState) {
		this.lib.settings.initRectFade = false;
		this.lib.animateNewClickarea(80, 0, 1500, 250,
			'bounce', this.lib.createClickarea);
	}

	render () {
		return (
			<div ref="svgWrapper">
				<img className="canvasIcon" />
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
