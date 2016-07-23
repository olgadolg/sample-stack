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
		const views = nextProps.views;
		const fill = nextProps.fill;
		const view = Object.keys(views);
		const index = view[view.length - 1];
		const currentView = nextProps.currentView;
		const image = nextProps.currentView.replace(/(.*)\.(.*?)$/, '$1');
		const libState = this.lib.state;

		this.lib.state.isNew = nextProps.isNew;
		this.lib.state.isSelected = nextProps.isSelected;

		this.setState({
			views: views,
			fill: fill,
			image: image,
			nodes: views[image].nodes,
			edges: views[image].edges,
			currentView: currentView,
			backgroundImg: views[currentView]
		}, () => {
			if (nextProps.viewUpdate === true || this.state.currentView !== null && this.props.currentView !== nextProps.currentView) {
				this.lib = new VectorDrawer(this.refs.svgWrapper, updateClickarea, removeClickarea, this.props.dispatch);

				$('.canvasIcon').attr('src', require('../../../images/' + self.state.currentView));
				this.lib.setState(this.state, nextProps.clickareas);
				this.lib.update();
			}

			if (nextProps.clickareas.isNew === true) {
				this.lib.state.currentView = views[index].viewId;

				this.props.dispatch(makeClickarea(
					nextProps.clickarea,
					this.state.currentView,
					this.lib.state.nodes,
					this.lib.state.edges
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
		views: state.clickareas.views,
		currentView: state.clickareas.currentView,
		fill: state.clickareas.fill,
		isNew: state.clickareas.isNew,
		isSelected: state.clickareas.isSelected,
		viewUpdate: state.clickareas.viewUpdate,
		clickarea: state.clickareas.clickarea
	};
};

export default connect(mapStateToProps)(Canvas);
