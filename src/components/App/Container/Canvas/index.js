import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import $ from 'jquery';
import classnames from 'classnames';
import Artist from './Artist';
import { saveCopy, saveArtistState, updateClickarea, removeClickarea, makeClickarea, createClickarea, unselectClickarea } from '../../../../actions/clickarea';
import { selectTool } from '../../../../actions/controls';
import { initLayer } from '../../../../actions/layer';
import styles from './styles/styles.css';

export default class Canvas extends Component {

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
			unselectClickarea,
			saveCopy,
			this.props.dispatch
		);

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
			artState.colors = this.state.colors;
			if (nextProps.eraseColor !== artState.eraseColor) {
				artState.eraseColor = nextProps.eraseColor;
				this.artist.update();
			}

			if (nextProps.prepareSave === true) {
				this.props.dispatch(saveArtistState(
					this.artist.state,
					this.artist.settings
				));
			}

			if (nextProps.addLayer === true) {
				this.createNewArtist(nextProps, drawingTool);
				artState.tool = tool;
				artState.viewUpdate = true;
				this.artist.hideCanvas();
			} else {
				this.artist.showCanvas();
			}

			if (drawingTool === 'copy' && nextProps.getCopy === true) {
				this.artist.saveCopy();
			}

			if (nextProps.getCopy == false && nextProps.saveCopy === true) {

				var arr = [];

				for (var i = 0; i < this.artist.state.nodes.length; i++) {
					arr.push(this.artist.state.nodes[i]);
				}

				/*
				var array = [

					[
						{
							x: 40,
							y: 30
						},
						{
							x: 80,
							y: 90
						}
					],
					[
						{
							x: 40,
							y: 30
						},
						{
							x: 80,
							y: 90
						}
					]
				]
				*/

				var newArray = [];


				for (var i = 0; i < this.artist.state.nodes[this.artist.settings.clickarea -1].length; i++) {
					var obj = {
						x: this.artist.state.nodes[this.artist.settings.clickarea -1][i].x + 30,
						y: this.artist.state.nodes[this.artist.settings.clickarea -1][i].y,
						closed: true
					}

					newArray.push(obj);
				}


				var nodes = this.artist.state.nodes.concat([newArray]);
				var edges = this.artist.state.edges.concat([nextProps.copy.edges]);

				$('.overlay').remove();
				this.props.dispatch(createClickarea());

				this.artist = new Artist(
					this.refs.svgWrapper,
					updateClickarea,
					removeClickarea,
					createClickarea,
					unselectClickarea,
					saveCopy,
					this.props.dispatch
				);

				this.props.dispatch(makeClickarea(
					{
						color: nextProps.color,
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
				this.artist.update();

			}

			if (artState.tool !== drawingTool) {
				artState.tool = drawingTool;
				this.artist.state.toolChange = true;

				this.artist.update();
			}

			if (artState.color !== nextProps.color) {
				artState.color = nextProps.color;
				this.artist.update();
			}

			if (nextProps.loadProject === true ||
				nextProps.viewUpdate === true ||
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
		});
	}

	createNewArtist (nextProps, tool, nodes, edges) {
		this.artist = new Artist(
			this.refs.svgWrapper,
			updateClickarea,
			removeClickarea,
			createClickarea,
			unselectClickarea,
			saveCopy,
			this.props.dispatch
		);


		this.artist.setState(this.state, nextProps.clickareas, nodes, edges);
		this.artist.state.tool = tool;
		this.artist.state.colors = this.state.colors;
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
