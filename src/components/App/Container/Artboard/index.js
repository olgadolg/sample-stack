import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import classnames from 'classnames';
import Artist from './Artist';
import { updateClickarea, removeClickarea, makeClickarea, createClickarea } from '../../../../actions/clickarea';
import { selectTool } from '../../../../actions/controls';
import { initLayer } from '../../../../actions/layer';
import styles from './styles/styles.css';

export default class Artboard extends Component {

	constructor (props) {
		super(props);

		this.state = {
			views: {},
			fill: false,
			currentView: null,
			backgroundImg: null,
			nodes: null,
			edges: null,
			fileData: null,
			name: null
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
		let drawingTool;

		artState.isNew = nextProps.isNew;
		artState.isSelected = nextProps.isSelected;

		if (this.props.currentView !== nextProps.currentView) {
			this.artist.state.shapeIsSelected = false;
		}

		if (typeof tool === 'undefined') {
			drawingTool = 'pen';
		} else {
			drawingTool = tool;
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
			tool: drawingTool,
			color: nextProps.color
		}, () => {
			if (artState.tool !== drawingTool) {
				artState.tool = drawingTool;
				this.artist.update();
			}

			if (artState.color !== nextProps.color) {
				artState.color = nextProps.color;
				this.artist.update();
			}

			if (nextProps.viewUpdate === true ||
				this.state.currentView !== null &&
				this.props.currentView !== nextProps.currentView) {
				this.createNewArtist(nextProps, drawingTool);
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

	handleDrop (files) {
		let reader = new FileReader();
		let file = files[0];

		reader.onload = ((theFile) => {
			return (e) => {
				this.setState({
					fileData: e.target.result,
					name: theFile.name
				}, () => {
					$('.dropzone').hide();
					this.props.dispatch(initLayer(this.state));
				});
			};
		})(file);

		reader.readAsDataURL(file);
	}

	render () {
		const dropzone = classnames({
			'dropzone': true,
			[styles.dropzone]: true
		});

		return (
			<div>
				<Dropzone
					className={dropzone}
					activeClassName={styles.activeDropzone}
					ref="dropzone"
					onDrop={this.handleDrop.bind(this)}>
				</Dropzone>
				<div className="svgWrapper" ref="svgWrapper">
					<img src={this.state.imageData} className="canvasIcon" />
				</div>
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
		tool: state.controls.tool,
		color: state.controls.color
	};
};

export default connect(mapStateToProps)(Artboard);
