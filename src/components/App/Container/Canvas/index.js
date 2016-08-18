import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import Draggable from 'react-draggable';
import classnames from 'classnames';
import Artist from './Artist';
import Utilities from '../../../../Utilities';
import { selectTool } from '../../../../actions/controls';
import { initLayer } from '../../../../actions/layer';
import styles from './styles/styles.css';
import { showDialog } from '../../../../actions/dialog';
import { resetRemoveView } from '../../../../actions/views';
import config from 'json!../../../../../assets/json/dialogs.json';
import { saveCut, saveCopy, updateClickarea, removeClickarea, makeClickarea, createClickarea, unselectClickarea } from '../../../../actions/clickarea';
import { saveWorkspace } from '../../../../actions/workspace';

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

		this.utilities = new Utilities();
		this.updateColor = this.updateColor.bind(this);
		this.setColoronFigureClick = this.setColoronFigureClick.bind(this);
		this.onStop = this.onStop.bind(this);
		this.onStart = this.onStart.bind(this);
		this.createInterpolation = this.createInterpolation.bind(this);
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
		const artState = this.artist.state;
		const drawingTool = (typeof tool === 'undefined') ? 'selectAll' : tool;

		artState.isNew = nextProps.isNew;
		artState.isSelected = nextProps.isSelected;

		if (this.props.currentView !== nextProps.currentView) {
			this.artist.state.shapeIsSelected = false;
		}

		this.createInterpolation(tool);

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
			copy: nextProps.saveCopy
		}, () => {
			this.cutFigure(nextProps, drawingTool);
			this.addLayer(nextProps, drawingTool, tool);
			this.updateColor(nextProps);
			this.setColor(nextProps, artState);
			this.eraseColor(nextProps);
			this.saveCopy(nextProps, drawingTool);
			this.addCopy(nextProps);
			this.changeTool(drawingTool, artState);
			this.loadLayers(nextProps, drawingTool, artState, tool);
			this.resetTool(nextProps);
			this.createNewFigure(nextProps, views, index, artState);
			this.pasteClickarea(nextProps, drawingTool);
			this.updateBackgroundImage(nextProps);
		});
	}

	createArtist () {
		this.artist = new Artist(
			this.refs.svgWrapper,
			updateClickarea,
			removeClickarea,
			createClickarea,
			unselectClickarea,
			saveCopy,
			this.setColoronFigureClick,
			this.props.dispatch
		);
	}

	updateBackgroundImage (nextProps, drawingTool) {
		if (nextProps.viewRemoved === true) {
			const image = document.getElementsByClassName('canvasIcon');
			const keys = Object.keys(nextProps.views);
			const length = keys.length;

			if (length === 0) return;

			image[0].src = nextProps.views[keys[length - 1]].fileData;

			this.props.dispatch(resetRemoveView());
			this.createArtist();
			this.updateArtist(nextProps, drawingTool, nextProps.views[keys[length - 1]].nodes, nextProps.views[keys[length - 1]].edges);
			this.artist.state.currentView = nextProps.currentView;
			this.artist.update();
		}
	}

	cutFigure (nextProps, drawingTool) {
		if (nextProps.cut === true) {
			var self = this;
			let classList = $('.overlay.selected').attr('class');
			let index = parseInt(classList.replace(/^\D+/g, ''));

			$.when(this.createDfClone(nextProps))
				.then(function (clone) {
					let cutNodes = self.artist.state.nodes.splice(index - 1, 1);
					let cutEdges = self.artist.state.edges.splice(index - 1, 1);
					self.props.dispatch(saveCut(cutNodes, cutEdges));
					self.createArtist();
					self.updateArtist(nextProps, drawingTool);
				}
			);
		}
	}

	saveCopy (nextProps, drawingTool) {
		if (drawingTool === 'copy' && nextProps.getCopy === true) {
			this.artist.saveCopy();
		}
	}

	createNewFigure (nextProps, views, index, artState) {
		if (nextProps.clickareas.isNew === true) {
			artState.currentView = views[index].viewId;

			this.props.dispatch(makeClickarea(
				nextProps.clickarea,
				this.state.currentView,
				artState.nodes,
				artState.edges
			));

			if (nextProps.tool === 'pen' ||
				nextProps.tool === 'stepBefore' ||
				nextProps.tool === 'bezier' ||
				nextProps.tool === 'cardinal'
			) {
				this.artist.createClickarea();
			}
		}
	}

	loadLayers (nextProps, drawingTool, artState, tool) {
		if (nextProps.loadProject === true ||
			nextProps.viewUpdate === true ||
			this.state.currentView !== null &&
			this.props.currentView !== nextProps.currentView) {
			this.createArtist();
			this.updateArtist(nextProps, drawingTool);
			artState.tool = tool;
			this.createInterpolation(tool);
			artState.viewUpdate = true;
		}
	}

	resetTool (nextProps) {
		if (this.state.currentView !== null &&
			this.props.currentView !== nextProps.currentView) {
			this.props.dispatch(selectTool('selectAll'));
		}
	}

	changeTool (drawingTool, artState) {
		if (artState.tool !== drawingTool) {
			if (drawingTool === 'rectangle') {
				this.artist.createGhostRect();
			}

			artState.tool = drawingTool;
			this.artist.state.toolChange = true;
			this.artist.update();
		}
	}

	pasteClickarea (nextProps) {
		if (nextProps.pasteClickarea === true) {
			let nodes = this.artist.state.nodes.concat(nextProps.cutItem.nodes);
			let edges = this.artist.state.edges.concat(nextProps.cutItem.edges);

			this.props.dispatch(createClickarea());
			this.createArtist();
			this.props.dispatch(makeClickarea(
				{
					color: nextProps.cutItem.nodes[0][0].color,
					coords: null,
					goTo: 'Figure',
					fill: true
				},
				this.state.currentView,
				nodes,
				edges
			));

			this.artist.setState(this.state, nextProps.clickareas, nodes, edges);
			this.artist.update();
			this.artist.updateClickarea();
		}
	}

	addCopy (nextProps) {
		if (nextProps.getCopy === false && nextProps.saveCopy === true) {
			let clone = this.createClone(nextProps);

			this.props.dispatch(createClickarea());
			this.createArtist();
			this.props.dispatch(makeClickarea(
				{
					color: clone.nodes[0][0].color,
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
		}
	}

	addLayer (nextProps, drawingTool, tool) {
		if (nextProps.addLayer === true) {
			this.createArtist();
			this.updateArtist(nextProps, drawingTool);
			this.artist.setState(this.state, nextProps.clickareas);
			this.artist.state.tool = tool;
			this.artist.hideCanvas();
		} else {
			this.artist.showCanvas();
		}
	}

	updateColor (nextProps) {
		if (this.state.colorClick === false) {
			this.setState({backgroundColor: nextProps.color});
		}
	}

	eraseColor (nextProps) {
		if (nextProps.eraseColor === true) {
			if (this.artist.state.nodes.length > 0) {
				for (var i = 0; i < this.artist.state.nodes[this.artist.settings.clickarea - 1].length; i++) {
					if (this.artist.settings.clickarea - 1 === nextProps.coordIndex) {
						this.artist.state.nodes[this.artist.settings.clickarea - 1][i].color = 'rgba(255, 255, 255, 0)';
					}
				}
			}
		}
		this.artist.update();
	}

	setColor (nextProps, artState) {
		if (nextProps.selectColor === true) {
			if (this.artist.state.nodes.length > 0 && nextProps.paste === false) {
				for (var i = 0; i < this.artist.state.nodes[this.artist.settings.clickarea - 1].length; i++) {
					if (this.artist.settings.clickarea - 1 === nextProps.colorIndex) {
						this.artist.state.nodes[this.artist.settings.clickarea - 1][i].color = nextProps.color;
					}
				}
			}

			this.setState({
				backgroundColor: nextProps.color,
				colorClick: false
			});
		}
	}

	setColoronFigureClick (color) {
		this.setState({
			backgroundColor: color,
			colorClick: true
		});
	}

	createClone (nextProps) {
		var newArray = [];

		for (var i = 0; i < this.artist.state.nodes[this.artist.settings.clickarea - 1].length; i++) {
			var obj = {
				color: this.artist.state.nodes[this.artist.settings.clickarea - 1][i].color,
				interpolate: this.artist.state.nodes[this.artist.settings.clickarea - 1][i].interpolate,
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

	createDfClone (nextProps) {
		const df = $.Deferred();
		const newArray = [];

		for (let i = 0; i < this.artist.state.nodes[this.artist.settings.clickarea - 1].length; i++) {
			let obj = {
				color: this.artist.state.nodes[this.artist.settings.clickarea - 1][i].color,
				interpolate: this.artist.state.nodes[this.artist.settings.clickarea - 1][i].interpolate,
				x: this.artist.state.nodes[this.artist.settings.clickarea - 1][i].x + 30,
				y: this.artist.state.nodes[this.artist.settings.clickarea - 1][i].y,
				closed: true
			};

			newArray.push(obj);
		}

		df.resolve({
			nodes: this.artist.state.nodes.concat([newArray]),
			edges: this.artist.state.edges.concat([nextProps.copy.edges])
		});

		return df.promise();
	}

	createInterpolation (toolName) {
		switch (toolName) {
		case 'pen':
			this.artist.state.interpolate = 'linear';
			break;

		case 'stepBefore':
			this.artist.state.interpolate = 'step-before';
			break;

		case 'bezier':
			this.artist.state.interpolate = 'basis';
			break;

		case 'rectangle':
			this.artist.state.interpolate = 'linear';
			break;

		case 'cardinal':
			this.artist.state.interpolate = 'cardinal';
			break;
		}
	}

	updateArtist (nextProps, tool, nodes, edges) {
		this.artist.setState(this.state, nextProps.clickareas, nodes, edges);
		this.artist.state.tool = tool;
		this.artist.update();
	}

	handleDrop (files) {
		const reader = new FileReader();
		const file = files[0];
		const layers = Object.keys(this.props.clickareas.views);
		const fileName = files[0].name.replace(/(.*)\.(.*?)$/, '$1');
		const data = config.dialogs.layerCopy;

		if (layers.indexOf(fileName) > -1) {
			this.props.dispatch(showDialog(data));
			return;
		}

		reader.onload = ((theFile) => {
			return (e) => {
				this.setState({
					files: files,
					fileData: e.target.result,
					name: theFile.name
				}, () => {
					$('.dropzone').hide();
					this.props.dispatch(initLayer(this.state));
					$('.layerIcon').removeClass('selectedTool');
					$('.selectAllIcon').addClass('selectedTool');
				});
			};
		})(file);

		reader.readAsDataURL(file);
	}

	onStart () {
		let canvasWrapper = document.getElementById('canvasWrapper');
		let controlsContainer = document.getElementById('controlsContainer');
		let header = document.getElementById('header');
		canvasWrapper.style.zIndex = '99999999';
		controlsContainer.style.zIndex = '9';
		header.style.zIndex = '9';
	}

	onStop (e, ui) {
		if (e.target.id === 'Save Workspace') {
			return;
		}

		const el = document.getElementById('canvasWrapper');
		const position = this.utilities.createPosition(ui, this.props, el);
		this.props.dispatch(saveWorkspace(position));
	}

	render () {
		const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
		const canvasWrapper = classnames({
			'canvasWrapper': true,
			[styles.canvasWrapper]: true
		});

		const dropzone = classnames({
			'dropzone': true,
			[styles.dropzone]: true
		});

		return (
			<Draggable cancel=".ghostRect, .bbRect, .path, .overlay" {...dragHandlers}>
				<div id="canvasWrapper" className={canvasWrapper}>
					<Dropzone
						className={dropzone}
						activeClassName={styles.activeDropzone}
						ref="dropzone"
						onDrop={this.handleDrop.bind(this)} />
					<div className="svgWrapper" ref="svgWrapper">
						<img src={this.state.imageData} className="canvasIcon" />
					</div>
				</div>
			</Draggable>
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
		eraseColor: state.clickareas.eraseColor,
		addLayer: state.clickareas.addLayer,
		loadProject: state.clickareas.loadProject,
		artistState: state.clickareas.artistState,
		artistSettings: state.clickareas.artistSettings,
		copy: state.clickareas.copy,
		saveCopy: state.clickareas.saveCopy,
		getCopy: state.clickareas.getCopy,
		cut: state.clickareas.cut,
		paste: state.clickareas.paste,
		cutItem: state.clickareas.cutItem,
		pasteClickarea: state.clickareas.pasteClickarea,
		viewRemoved: state.clickareas.viewRemoved,
		workspace: state.clickareas.workspace,
		coordIndex: state.clickareas.coordIndex,
		colorIndex: state.clickareas.colorIndex,
		selectColor: state.clickareas.selectColor
	};
};

export default connect(mapStateToProps)(Canvas);
