import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import classnames from 'classnames';
import Artist from './Artist';
import { selectTool } from '../../../../actions/controls';
import { initLayer } from '../../../../actions/layer';
import styles from './styles/styles.css';
import { saveCopy, saveArtistState, updateClickarea, removeClickarea, makeClickarea, createClickarea, unselectClickarea } from '../../../../actions/clickarea';

export default class Canvas extends Component {

	constructor (props) {
		super(props);

		this.state = {
			views: {},
			fill: false,
			currentView: null,
			backgroundImg: null,
			backgroundColor: '#000',
			nodes: null,
			edges: null,
			fileData: null,
			name: null,
			color: null,
			colorClick: false
		};

		this.setColor = this.setColor.bind(this);
	}

	createArtist () {
		this.artist = new Artist(
			this.refs.svgWrapper,
			updateClickarea,
			removeClickarea,
			createClickarea,
			unselectClickarea,
			saveCopy,
			this.setColor,
			this.props.dispatch
		);
	}

	componentDidMount () {
		this.createArtist();
		this.artist.update(this.state);
	}

	componentDidUpdate (prevProps) {
		if (this.props.tool === prevProps.tool) {
			this.artist.update(this.state);
		}
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
			imageData: (typeof views[image] === 'undefined') ? '' : views[image].fileData,
			nodes: (typeof views[image] === 'undefined') ? '' : views[image].nodes,
			edges: (typeof views[image] === 'undefined') ? '' : views[image].edges,
			currentView: currentView,
			backgroundImg: views[currentView],
			tool: drawingTool,
			color: nextProps.color,
			colors: nextProps.colors,
			copy: nextProps.saveCopy
		}, () => {
			if (nextProps.addLayer === true) {
				this.createArtist();
				this.updateArtist(nextProps, drawingTool);
				this.artist.setState(this.state, nextProps.clickareas);
				this.artist.state.tool = tool;
				this.artist.hideCanvas();
			} else {
				this.artist.showCanvas();
			}

			if (this.state.colorClick === false) {
				this.setState({backgroundColor: nextProps.color});
			}

			if (artState.color !== nextProps.color) {
				this.setState({
					backgroundColor: nextProps.color,
					colorClick: false
				});
			}

			if (drawingTool === 'copy' && nextProps.getCopy === true) {
				this.artist.saveCopy();
			}

			if (nextProps.getCopy === false && nextProps.saveCopy === true) {
				let clone = this.createClone(nextProps);

				this.props.dispatch(createClickarea());
				this.createArtist();
				this.props.dispatch(makeClickarea(
					{
						color: this.state.backgroundColor,
						coords: null,
						goTo: 'Figure',
						fill: true
					},
					this.state.currentView,
					clone.nodes,
					clone.edges
				));

				this.artist.setState(this.state, nextProps.clickareas, clone.nodes, clone.edges);
				this.artist.update();
				this.artist.updateClickarea();
				this.artist.update();
			}

			if (artState.tool !== drawingTool) {
				artState.tool = drawingTool;
				this.artist.state.toolChange = true;
				this.artist.update();
			}

			if (nextProps.loadProject === true ||
				nextProps.viewUpdate === true ||
				this.state.currentView !== null &&
				this.props.currentView !== nextProps.currentView) {
				this.createArtist();
				this.updateArtist(nextProps, drawingTool);
				artState.tool = tool;
				artState.viewUpdate = true;
			}

			if (this.state.currentView !== null &&
				this.props.currentView !== nextProps.currentView) {
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
		});
	}

	setColor (color) {
		this.setState({
			backgroundColor: color,
			colorClick: true
		});
	}

	createClone (nextProps) {
		var newArray = [];

		for (var i = 0; i < this.artist.state.nodes[this.artist.settings.clickarea - 1].length; i++) {
			var obj = {
				x: this.artist.state.nodes[this.artist.settings.clickarea - 1][i].x + 30,
				y: this.artist.state.nodes[this.artist.settings.clickarea - 1][i].y,
				closed: true
			};

			newArray.push(obj);
		}

		return {
			nodes: this.artist.state.nodes.concat([newArray]),
			edges: this.artist.state.edges.concat([nextProps.copy.edges])
		};
	}

	updateArtist (nextProps, tool, nodes, edges) {
		this.artist.setState(this.state, nextProps.clickareas, nodes, edges);
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
					files: files,
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
					onDrop={this.handleDrop.bind(this)} />
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
		tool: state.clickareas.tool,
		color: state.clickareas.color,
		colors: state.clickareas.colors,
		eraseColor: state.clickareas.eraseColor,
		addLayer: state.clickareas.addLayer,
		loadProject: state.clickareas.loadProject,
		prepareSave: state.clickareas.prepareSave,
		artistState: state.clickareas.artistState,
		artistSettings: state.clickareas.artistSettings,
		copy: state.clickareas.copy,
		saveCopy: state.clickareas.saveCopy,
		getCopy: state.clickareas.getCopy
	};
};

export default connect(mapStateToProps)(Canvas);
