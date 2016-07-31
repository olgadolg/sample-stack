import React, { Component } from 'react';
import { connect } from 'react-redux';
import Artist from './Artist';
import { updateClickarea, removeClickarea, makeClickarea, createClickarea } from '../../../../actions/clickarea';
import { selectTool } from '../../../../actions/controls';

export default class Artboard extends Component {

	constructor (props) {
		super(props);

		this.state = {
			views: {},
			fill: false,
			currentView: null,
			backgroundImg: null,
			nodes: null,
			edges: null
		};
	}

	componentDidMount () {
		this.artist = new Artist(
			this.refs.svgWrapper,
			updateClickarea,
			removeClickarea,
			createClickarea,
			this.props.dispatch
		);

		this.artist.update(this.state);
	}

	componentDidUpdate (prevProps) {
		this.artist.update(this.state);
	}

	componentWillReceiveProps (nextProps) {
		const views = nextProps.views;
		const fill = nextProps.fill;
		const view = Object.keys(views);
		const index = view[view.length - 1];
		const currentView = nextProps.currentView;
		const image = nextProps.currentView.replace(/(.*)\.(.*?)$/, '$1');
		const tool = nextProps.tool;
		let artState = this.artist.state;

		artState.isNew = nextProps.isNew;
		artState.isSelected = nextProps.isSelected;

		if (this.props.currentView !== nextProps.currentView) {
			this.artist.state.shapeIsSelected = false;
		}

		this.setState({
			views: views,
			fill: fill,
			image: image,
			imageData: views[image].fileData,
			nodes: views[image].nodes,
			edges: views[image].edges,
			currentView: currentView,
			backgroundImg: views[currentView],
			tool: tool
		}, () => {
			if (artState.tool !== tool) {
				artState.tool = tool;
				this.artist.update();
			}

			if (nextProps.viewUpdate === true ||
				this.state.currentView !== null &&
				this.props.currentView !== nextProps.currentView) {
				this.createNewArtist(nextProps, tool);
				artState.tool = tool;
				artState.viewUpdate = true;
			}

			if (this.state.currentView !== null && this.props.currentView !== nextProps.currentView) {
				this.props.dispatch(selectTool('pen'));
			}

			if (nextProps.clickareas.isNew === true) {
				artState.currentView = views[index].viewId;

				this.props.dispatch(makeClickarea(
					nextProps.clickarea,
					this.state.currentView,
					artState.nodes,
					artState.edges
				));

				this.openClickarea(nextProps);
			}

			if (typeof this.props.clickareas.isNew !== undefined) {
				const form = document.getElementById('createForm');
				form.style.display = 'block';
			}
		});
	}

	createNewArtist (nextProps, tool) {
		this.artist = new Artist(
			this.refs.svgWrapper,
			updateClickarea,
			removeClickarea,
			createClickarea,
			this.props.dispatch
		);

		this.artist.setState(this.state, nextProps.clickareas);
		this.artist.state.tool = tool;
		this.artist.update();
	}

	openClickarea (nextProps) {
		if (nextProps.tool === 'pen') {
			this.artist.createClickarea();
		}
	}

	render () {
		return (
			<div ref="svgWrapper">
				<img src={this.state.imageData} className="canvasIcon" />
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
		clickarea: state.clickareas.clickarea,
		tool: state.controls.tool
	};
};

export default connect(mapStateToProps)(Artboard);
