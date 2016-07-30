import d3 from 'd3';
import $ from 'jquery';
import { Component } from 'react';
import d3BBox from '../../../../../lib/d3bbox';
import './styles/styles.css';

export default class DrawVectors extends Component {

	constructor (el, updateOverlayFn, removeOverlayFn, createOverlayFn, dispatch) {
		super();

		const self = this;
		const svg = d3.selectAll('svg');

		if (svg.length > 0) {
			svg.remove();
		}

		this.state = {
			nodes: [],
			edges: [],
			handelsize: null,
			shapes: 0,
			tool: 'pen',
			freezedNodes: [],
			dirs: ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'],
			handlesize: {'w': 5, 'n': 5, 'e': 5, 's': 5},
			props: null,
			coords: null,
			remove: false,
			multiple: true,
			selectedNode: null,
			selectedEdge: null,
			mouseDown: false,
			shapeIsSelected: false,
			nodeIsDragged: false,
			multipleSelection: false,
			init: true,
			viewUpdate: false,
			multipleHandles: []
		};

		this.settings = {
			width: 1024,
			height: 570,
			clickarea: 0,
			dispatch: dispatch,
			updateOverlayFn: updateOverlayFn,
			removeOverlayFn: removeOverlayFn,
			createOverlayFn: createOverlayFn,
			selectedClass: 'selected',
			containerclass: 'overlay selected overlay' + self.state.shapes.toString(),
			backspace_key: 8,
			delete_key: 46,
			alt_key: 18,
			nodeRadius: 3
		};

		this.win = d3.select(window);

		this.createCanvas(el);
		this.initLineCreator();

		this.bindEvents();
		this.bindDrag();
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	initLineCreator () {
		this.lineCreator = d3.svg.line()
			.x(function (d, i) { return d.x; })
			.y(function (d) { return d.y; });
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createCanvas (el) {
		this.svg = d3.select(el)
			.append('svg')
			.attr({
				height: this.settings.height,
				width: this.settings.width
			});
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	setState (state, clickareas) {
		this.state.nodes = state.nodes;
		this.state.edges = state.edges;
		this.state.isSelected = state.isSelected;
		this.state.currentView = state.image;
		this.state.props = clickareas;
		this.state.changeView = true;
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removeBBRect () {
		if (this.pathBox) {
			this.pathBox.remove();
		}
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createClickarea () {
		this.state.shapes++;
		this.settings.clickarea = this.state.shapes;
		this.state.shapeIsSelected = true;

		this.svgG = this.svg.append('g')
			.classed('overlay selected overlay' + this.state.shapes.toString(), true);

		let x = d3.mouse(d3.select('svg').node())[0];
		let y = d3.mouse(d3.select('svg').node())[1];

		this.state.nodes.push(
			[
				{clickarea: this.state.shapes, title: 'Node1', id: 0, x: x, y: y},
				{clickarea: this.state.shapes, title: 'Node2', id: 1, x: x, y: y}
			]
		);

		this.state.edges.push([
			{
				closed: false,
				source: {clickarea: this.state.shapes, title: 'Node1', id: 0, x: x, y: y},
				target: {clickarea: this.state.shapes, title: 'Node2', id: 1, x: x, y: y}
			}
		]);

		this.createGroups();
		this.update();
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createContainer (index) {
		this.state.shapes = parseInt(index + 1);
		this.settings.clickarea = parseInt(index + 1);
		this.settings.containerclass = 'overlay' + parseInt(index + 1);
		this.state.shapeIsSelected = true;

		let newG = this.svg.append('g')
			.classed('overlay overlay ' + this.settings.containerclass, true);

		this.svgG = newG;

		this.path = newG.append('g')
			.attr('class', 'path')
			.selectAll('g');

		this.handles = newG.append('g')
			.attr('class', 'handles')
			.selectAll('g');
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	toggleFill () {
		if (this.state.fill === true) {
			d3.selectAll('.clickarea').attr('fill-opacity', 0);
			this.fill = false;
		} else {
			d3.selectAll('.clickarea').attr('fill-opacity', 0.5);
			this.fill = true;
		}
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createGroups () {
		this.path = this.svgG
			.append('g')
			.attr('class', 'path')
			.selectAll('g');

		this.handles = this.svgG
			.append('g')
			.attr('class', 'handles')
			.selectAll('g');
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	bindEvents () {
		const self = this;

		this.svg
			.on('mousedown', function (d) { self.svgMouseDown(d); })
			.on('mouseup', function (d) { self.svgMouseUp(d); });

		this.win
			.on('keydown', function () { self.svgKeyDown(); })
			.on('keyup', function () { self.svgKeyUp(); });
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	bindDrag () {
		const self = this;

		this.dragHandle = d3.behavior.drag()
			.origin(function (d) {
				return {x: d.x, y: d.y};
			})
			.on('dragstart', function (d) {
				self.state.nodeIsDragged = true;
			})
			.on('drag', function (d) {
				self.updateClickarea();
				d3.select(this).classed('selected', true);
				self.dragmove(d);
			})
			.on('dragend', function (d) {
				self.updateClickarea();
			});

		this.dragClickarea = d3.behavior.drag()
			.on('drag', function (d, i) {
				if (self.state.tool === 'pen') {
					return;
				}

				$('.bbRect').remove();
				delete self.pathBox;
				self.updateClickarea();

				for (i = 0; i < self.state.nodes[self.settings.clickarea - 1].length; i++) {
					self.state.nodes[self.settings.clickarea - 1][i].x += d3.event.dx;
					self.state.nodes[self.settings.clickarea - 1][i].y += d3.event.dy;
				}

				self.update();

				if (self.state.tool === 'selectAll') {
					d3.selectAll('.bbRect').remove();
					self.createDragBox();
				}
			})
			.on('dragend', function (d, i) {
				//self.tooltip.style('opacity', 0.9);
				self.updateClickarea();
			});
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	svgKeyDown () {
		if (Object.keys(this.state.props.views).length === 0) {
			return;
		}

		const selectedNode = this.state.selectedNode;

		if (this.state.multipleSelection === true) {
			return;
		}

		switch (d3.event.keyCode) {
		case this.settings.alt_key:
			d3.selectAll('.handle').classed(this.settings.selectedClass, false);
			this.state.multipleSelection = true;
			break;

		case this.settings.backspace_key:
		case this.settings.delete_key:

			if ($('.textfield').is(':focus') === false) {
				d3.event.preventDefault();
			}

			if (this.state.shapeIsSelected === true) {
				if (confirm('Are you sure you want to remove this clickarea?')) {
					d3.selectAll('.overlay' + parseInt(this.settings.clickarea)).remove();
					//d3.selectAll('.d3-tooltip').style('opacity', 0);
					this.state.nodes.splice(this.settings.clickarea - 1, 1);
					this.state.edges.splice(this.settings.clickarea - 1, 1);
					this.state.shapes--;
					this.state.shapeIsSelected = false;
					this.state.multipleHandles = [];
					this.cleanupElements();
					this.removeClickarea(this.settings.clickarea - 1);
					this.pathBox.remove();
					this.update();
				}
			} else if (selectedNode) {
				if (confirm('Are you sure you want to remove this point?')) {
					this.state.nodes[this.settings.clickarea - 1]
						.splice(this.state.nodes[this.settings.clickarea - 1]
						.indexOf(selectedNode), 1);

					this.spliceLinksForNode(selectedNode);
					this.state.selectedNode = null;
					this.state.shapeIsSelected = true;
					this.state.multipleHandles = [];
					this.updateClickarea();
					this.update();
				}
			}
			break;
		}
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	cleanupElements () {
		$('.clickarea' + parseInt(this.settings.clickarea)).remove();

		for (let i = 0; i < $('.clickarea').length; i++) {
			let el = $('.clickarea')[i];

			$(el)
				.removeClass()
				.addClass('clickarea')
				.addClass('clickarea' + parseInt(i + 1));
		}

		for (let i = 0; i < $('.overlay').length; i++) {
			let el = $('.overlay')[i];

			$(el)
				.removeClass()
				.addClass('overlay')
				.addClass('overlay' + parseInt(i + 1));
		}
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	svgKeyUp () {
		this.state.multipleSelection = false;
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	svgMouseDown (d) {
		const self = this;

		if (Object.keys(this.state.props.views).length === 0) {
			return;
		}

		if (d3.event.target.tagName === 'path' && d3.event.target.attributes.d.nodeValue.indexOf('z') > -1) {
			if (self.state.edges.length > 0) {
				//console.log(self.state.edges, self.state.nodes)
			}
			return;
		}

		if (this.state.nodes.length === 0 && this.state.tool !== 'pen') {
			return;
		}

		this.state.mouseDown = true;
		this.state.selectedNode = false;
		this.state.nodeIsDragged = false;
		this.state.viewUpdate = false;
		this.state.multiple = true;

		if (this.state.nodes.length === 0 || this.state.nodes[this.settings.clickarea - 1].length === 0 || d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').attr('d').indexOf('z') > -1) {
			if (this.state.tool === 'pen') {
				this.state.init = true;
				this.state.mouseDown = false;
				this.settings.dispatch(this.settings.createOverlayFn('Daniel'));
			}
		}

		if (d3.event.target.tagName !== 'path' && this.state.multipleSelection === false && d3.event.target.nodeName !== 'rect') {
			d3.selectAll('.handle').classed('selected', false);

			this.state.shapeIsSelected = false;

			if (d3.selectAll('.clickarea' + this.settings.clickarea).attr('d').indexOf('z') > -1) {
				delete this.pathBox;
				d3.selectAll('.bbRect').remove();
			}

			if (this.state.tool !== 'pen' && this.state.tool !== 'penAdd') {
				d3.selectAll('.handle').classed('invisible', true);
				d3.selectAll('.bbRect').remove();
				this.state.shapeIsSelected = false;
				delete this.pathBox;
			}
		} else if (this.state.multipleSelection === true && this.state.multipleHandles.length === 2) {
			this.multipleDataUpdate();
			this.update();
		}
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	multipleDataUpdate () {
		let isClosed = false;

		d3.selectAll('.handle').classed('selected', false);

		for (let i = 0; i < this.state.edges[this.settings.clickarea - 1].length; i++) {
			if (this.state.edges[this.settings.clickarea - 1][i].closed === true) {
				isClosed = true;
			}
		}

		let node = {
			clickarea: this.settings.clickarea,
			id: this.state.nodes[parseInt(this.settings.clickarea - 1)].length,
			x: d3.mouse(d3.select('svg').node())[0],
			y: d3.mouse(d3.select('svg').node())[1]
		};

		let edge = {
			closed: isClosed,
			source: null,
			target: null
		};

		if (this.state.multipleHandles[0] === 0 && this.state.multipleHandles[1] !== 1) {
			this.state.nodes[parseInt(this.settings.clickarea - 1)].push(node);
		} else {
			this.state.nodes[parseInt(this.settings.clickarea - 1)].splice(this.state.multipleHandles[1], 0, node);
		}

		this.state.edges[parseInt(this.settings.clickarea - 1)].push(edge);

		for (let i = 0; i < this.state.edges[this.settings.clickarea - 1].length; i++) {
			for (let j = 0; j < this.state.nodes[this.settings.clickarea - 1].length; j++) {
				if (j === i) {
					this.state.edges[this.settings.clickarea - 1][i].source = this.state.nodes[this.settings.clickarea - 1][j];
					this.state.edges[this.settings.clickarea - 1][i].target = this.state.nodes[this.settings.clickarea - 1][j + 1];
				}
			}
		}

		delete this.lastHandleClicked;
		this.state.multipleHandles = [];
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	svgMouseUp () {
		if (Object.keys(this.state.props.views).length === 0) {
			return;
		}

		if (this.state.nodes.length === 0 && this.state.tool !== 'pen') {
			return;
		}

		this.makePenAddPoint();

		if (this.state.mouseDown && this.state.tool === 'pen') {
			if (this.settings.clickarea == null) {
				return;
			}

			let nodes = this.state.nodes;
			let edges = this.state.edges;
			let clickarea = this.settings.clickarea - 1;
			let xycoords = d3.mouse(this.svgG.node());

			let node = {
				id: this.idct++,
				clickarea: this.settings.clickarea,
				x: xycoords[0],
				y: xycoords[1]
			};

			if (nodes[clickarea].length > 0) {
				nodes[clickarea].push(node);
			}

			if (nodes[clickarea].length === 2 && this.state.init === true) {
				nodes[clickarea][1] = nodes[clickarea][0];
			}

			if (nodes[clickarea].length === 3 && this.state.init === true) {
				edges[clickarea][0].target.x = xycoords[0];
				edges[clickarea][0].target.y = xycoords[1];
				nodes[clickarea].splice(0, 1);
				this.state.init = false;
			}

			this.updateClickarea();
			this.update();
		}

		this.state.mouseDown = false;
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	handleMouseDown (d3node, d) {
		d3.event.stopPropagation();
		this.state.mouseDownNode = d;
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	handleMouseUp (d3node, d, props) {
		const self = this;

		d3node.classed(this.settings.connectClass, false);

		if (self.state.tool !== 'pen') {
			if (self.state.selectedEdge) {
				self.removeSelectFromEdge();
			}

			let prevNode = self.state.selectedNode;

			if (!prevNode || prevNode.id !== d.id) {
				self.replaceSelectNode(d3node, d);
			} else {
				self.removeSelectFromNode();
			}
		}
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	replaceSelectNode (d3Node, nodeData, props) {
		if (this.state.selectedNode) {
			this.removeSelectFromNode(props);
		}

		this.state.selectedNode = nodeData;
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	replaceSelectEdge (d3Path, edgeData, props) {
		d3Path.classed(this.settings.selectedClass, true);

		if (this.state.selectedEdge) {
			this.removeSelectFromEdge();
		}

		this.state.selectedEdge = edgeData;
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removeSelectFromNode () {
		const self = this;

		this.handles.filter(function (handle) {
			return handle.id === self.state.selectedNode.id;
		}).classed(this.settings.selectedClass, false);

		this.state.selectedNode = null;
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removeSelectFromEdge () {
		const self = this;

		this.paths.filter(function (path) {
			return path === self.state.selectedEdge;
		}).classed(this.settings.selectedClass, false);

		this.state.selectedEdge = null;
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	spliceLinksForNode (node) {
		const self = this;
		const edges = self.state.edges;
		const clickarea = self.settings.clickarea - 1;
		const toSplice = edges[clickarea].filter(function (edge) {
			return (edge.source === node || edge.target === node);
		});

		toSplice.map(function (l) {
			edges[clickarea].splice(edges[clickarea].indexOf(l), 1);
		});

		d3.selectAll('.handle').classed('selected', false);
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	dragmove (d) {
		d.x += d3.event.dx;
		d.y += d3.event.dy;
		this.update();
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	handleMultipleClick (i) {
		var path = d3.selectAll('.clickarea' + this.state.shapes).attr('d');
		var multiHandles = this.state.multipleHandles;
		var multiSelection = this.state.multipleSelection;
		var nodes = this.state.nodes;
		var dataIndex = this.settings.clickarea - 1;

		if (multiSelection) {
			if (multiHandles.length < 2) {
				if (multiHandles.length === 0) {
					multiHandles.push(i);
				} else {
					if (
						multiHandles.indexOf(i - 1) > -1 ||
						multiHandles.indexOf(i + 1) > -1 ||
						i === 0 && multiHandles.indexOf(nodes[dataIndex].length - 1) > -1 && path.indexOf('z') > -1 ||
						i === nodes[dataIndex].length - 1 && multiHandles.indexOf(0) > -1 && path.indexOf('z') > -1 && multiHandles.indexOf(i) === -1) {
						multiHandles.push(i);
					} else {
						multiHandles[0] = i;
						delete this.lastHandleClicked;
					}
				}
			} else {
				if (multiHandles[1] === i - 1 || multiHandles[1] === i + 1) {
					multiHandles[0] = multiHandles[1];
					multiHandles[1] = i;
				} else {
					multiHandles = [];
					multiHandles[0] = i;
					delete this.lastHandleClicked;
				}
			}
		} else {
			multiHandles = [];
		}

		multiHandles.sort();
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	closeEdge (i) {
		var nodes = this.state.nodes;
		var edges = this.state.edges;
		var multiSelection = this.state.multipleSelection;
		var dataIndex = this.settings.clickarea - 1;

		if (i === 0 && nodes[dataIndex].length > 2 && multiSelection === false) {
			if (this.state.tool === 'pen') {
				for (let j = 0; j < edges[dataIndex].length; j++) {
					edges[dataIndex][j].closed = true;
				}
			}
		}
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createHandles () {
		const self = this;

		this.handle = d3.selectAll('.handles')
			.data(self.state.nodes)
				.selectAll('.handle')
				.data(function (d) { return d; });

		this.handle
			.classed('filled', true)
			.attr('transform', function (d) {
				return 'translate(' + d.x + ',' + d.y + ')';
			});

		this.handle
			.enter()
			.append('circle')
			.attr('class', function (d, i) {
				let visible = (self.state.tool === 'penadd' || d.clickarea === self.settings.clickarea && self.state.isSelected === false) ? '' : 'invisible';
				return 'handle' + ' ' + 'handle' + parseInt(i + 1) + ' ' + visible;
			})
			.attr('r', String(self.settings.nodeRadius))
			.attr('transform', function (d) {
				return 'translate(' + d.x + ',' + d.y + ')';
			})
			.on('mousedown', function (d, i) {
				self.closeEdge(i);
				self.handleMultipleClick(i);
				self.handleMouseDown(d);
				self.update();

				self.state.nodeIsDragged = false;
				d3.selectAll('.handle').classed('selected', false);

				if (d3.select('.clickarea' + self.settings.clickarea).attr('d').indexOf('z') > -1) {
					self.state.shapeIsSelected = false;
				}

				if (self.state.tool !== 'pen') {
					d3.select(this).classed('selected', true);
					if (typeof this.pathBox !== 'undefined') {
						delete this.pathBox;
						d3.selectAll('.bbRect').remove();
					}
				}

				if (self.state.multipleSelection === true) {
					if (typeof self.lastHandleClicked !== 'undefined' && self.state.multipleHandles.length === 2) {
						d3.select(self.lastHandleClicked.node()).classed(self.settings.selectedClass, true);
						d3.select(this).classed(self.settings.selectedClass, true);
					}

					self.lastHandleClicked = d3.select(this);
				}
			})
			.on('mouseup', function (d) {
				self.handleMouseUp(d3.select(this), d);
			})
			.call(self.dragHandle);

		this.handle.exit().remove();
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	makePenAddPoint (self) {
		self = self || this;

		for (var i = 0; i < self.state.nodes[self.settings.clickarea - 1].length; i++) {
			if (i !== self.state.nodes[self.settings.clickarea - 1].length - 1) {
				let isBetween = self.isBetween(self.state.nodes[self.settings.clickarea - 1][i], self.state.nodes[self.settings.clickarea - 1][i + 1], {x: d3.mouse(d3.select('svg').node())[0], y: d3.mouse(d3.select('svg').node())[1]}, 15);

				console.log(self.state.tool)

				if (isBetween === true && self.state.tool === 'penAdd') {
					if (self.state.multiple === true) {
						self.state.nodes[self.settings.clickarea - 1].splice(i + 1, 0, {x: d3.mouse(d3.select('svg').node())[0], y: d3.mouse(d3.select('svg').node())[1]});
						self.state.multiple = false;
						self.update();
						console.log(i);
						console.log(self.state.tool);
					}
				}
			} else {
				let isBetween = self.isBetween(self.state.nodes[self.settings.clickarea - 1][i], self.state.nodes[self.settings.clickarea - 1][0], {x: d3.mouse(d3.select('svg').node())[0], y: d3.mouse(d3.select('svg').node())[1]}, 15);

				if (isBetween === true && self.state.tool === 'penAdd') {
					if (self.state.multiple === true) {
						self.state.nodes[self.settings.clickarea - 1].push({x: d3.mouse(d3.select('svg').node())[0], y: d3.mouse(d3.select('svg').node())[1]});
						self.state.multiple = false;
						self.update();
						console.log(i);
						console.log(self.state.tool);
					}
				}
			}
		}
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createPath () {
		const self = this;
		const views = this.state.props.views;
		const currentView = this.state.currentView;
		var z;

		this.clickareas = d3.selectAll('.path')
			.data(self.state.edges);

		this.clickareas
			.each(function (d, i) {
				d3.selectAll('.clickarea' + parseInt(i + 1)).remove();

				d3.select(this)
					.append('path')
					.attr('data-id', function (d) {
						if (Object.keys(views[currentView].clickareas).length > 0) {
							return views[currentView].clickareas[i].goTo;
						}
					})
					.attr('class', function (d) {
						return 'clickarea ' + 'clickarea' + parseInt(i + 1);
					})
					.attr('fill-opacity', function (d) {
						return (self.state.props.fill === true) ? 0.5 : 0;
					})
					.attr('d', function (d, k) {
						if (d.length === 0) {
							z = 'z';
						} else {
							z = (d[d.length - 1].closed === true) ? 'z' : '';
						}

						return self.lineCreator(self.state.nodes[i]) + z;
					})
					.on('click', function (d, i) {
						if (self.state.tool === 'pen') {
							return;
						}
						d3.select(this).classed('selected', true);
					})
					.on('mousedown', function () {
						self.state.multiple = true;

						if (self.state.tool === 'pen') {
							return;
						}

						if (self.state.multipleHandles.length < 2) {
							self.state.multipleHandles = [];
						}

						d3.selectAll('.overlay' + self.settings.clickarea).classed('selected', true);
						d3.selectAll('.handle').classed('selected', false);

						self.settings.clickarea = parseInt(
							d3.select(this).attr('class')
								.replace('clickarea', '')
								.replace('clickarea', '')
						);

						if (self.state.tool === 'select') {
							d3.selectAll('.handle').classed('invisible', true);
							d3.selectAll('.overlay' + parseInt(self.settings.clickarea) + ' .handle').classed('invisible', false);
						}

						self.state.shapeIsSelected = true;

						d3.selectAll('.bbRect').classed('inactive', true);
						d3.selectAll('.overlay').classed('selected', false);
						d3.selectAll('.overlay' + parseInt(self.settings.clickarea)).classed('selected', true);

						if (self.state.tool === 'selectAll') {
							d3.selectAll('.bbRect.inactive').remove();
							self.createDragBox();
						}
					})
					.on('mouseup', function (d) {
						d3.selectAll('.overlay' + parseInt(self.settings.clickarea) + ' .handle').classed('selected', false);
						self.makePenAddPoint(self);
					})
					.call(self.dragClickarea);
			});

		this.clickareas
			.enter()
			.append('g')
			.each(function (d, i) {
				d3.select(this)
					.append('path')
					.attr('data-id', function (d) {
						if (Object.keys(views[currentView].clickareas).length > 0) {
							return views[currentView].clickareas[i].goTo;
						}
					})
					.attr('class', 'clickarea')
					.attr('d', function (d, i) {
						return self.lineCreator([self.state.nodes[i]]);
					})
					.on('click', function (d, i) {
						d3.select(this).classed('selected', true);
					}
					.call(self.dragClickarea)
				);
			});

		this.clickareas.exit().remove();
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	containerCreator () {
		if (d3.selectAll('.overlay').length > this.state.edges.length || this.state.isNew === false) {
			return;
		}

		$('.overlay').remove();

		for (let i = 0; i < this.state.edges.length; i++) {
			this.createContainer(i);
			d3.selectAll('.overlay' + parseInt(i + 1))
				.classed('selected', i < this.state.edges.length - 1);
		}
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	updateClickarea () {
		this.state.pathData = d3.select('.clickarea' + this.settings.clickarea).attr('d');
		this.settings.dispatch(
			this.settings.updateOverlayFn(
				this.state.pathData,
				this.settings.clickarea - 1,
				this.state.currentView,
				this.state.nodes,
				this.state.edges
			)
		);
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removeClickarea (index) {
		this.settings.dispatch(
			this.settings.removeOverlayFn(
				index,
				this.state.nodes,
				this.state.edges
			)
		);
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	whichborder (xy, elem) {
		let border = '';
		let x = +elem.getAttribute('x');
		let y = +elem.getAttribute('y');
		let w = +elem.getAttribute('width');
		let h = +elem.getAttribute('height');

		if (xy[1] < y + this.state.handlesize.n) {
			border += 'n';
		} else if (xy[1] > y + h - this.state.handlesize.s) {
			border += 's';
		}

		if (xy[0] < x + this.state.handlesize.w) {
			border += 'w';
		} else if (xy[0] > x + w - this.state.handlesize.e) {
			border += 'e';
		}

		if (border === '' && (this.state.dirs.indexOf('x') > -1 || this.state.dirs.indexOf('y') > -1)) {
			border = 'M';
		} else if (this.state.dirs.indexOf(border) === -1) {
			border = '';
		}

		return border;
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	arrayContains (array, obj) {
		var i = array.length;

		while (i--) {
			if (array[i] === obj) {
				return true;
			}
		}
		return false;
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	freezeNodes (self, box) {
		self.state.freezedNodes = self.state.nodes[self.settings.clickarea - 1]
			.filter(function (node, i) {
				switch (self.state.direction) {
				case 'e':
					return node.x === box.x + 3;
				case 'w':
					return node.x === (box.x + box.width) - 3;
				case 'n':
					return node.y === (box.y + box.height) - 3;
				case 's':
					return node.y === box.y + 3;
				case 'sw':
					return node.y === 100000;
				case 'ew':
					return node.y === 100000;
				case 'nw':
					return node.y === 100000;
				case 'ne':
					return node.y === 100000;
				}
			});
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	applyFreezedNodes (self, box) {
		var nodes = self.state.nodes;
		var dataIndex = self.settings.clickarea - 1;

		for (let i = 0; i < nodes[dataIndex].length; i++) {
			if (self.arrayContains(self.state.freezedNodes, nodes[dataIndex][i]) === false) {
				var x1 = box.width - Math.ceil(nodes[dataIndex][i].x - box.x);
				var x2 = box.width - x1;
				var y1 = box.height - (nodes[dataIndex][i].y - box.y);
				var y2 = box.height - y1;
				var deltaX, deltaY;

				switch (self.state.direction) {
				case 'w':
					deltaX = x1 / box.width;
					break;

				case 'e':
					deltaX = x2 / box.width;
					break;

				case 'n':
					deltaY = y1 / box.height;
					break;

				case 's':
					deltaY = y2 / box.height;
					break;

				case 'sw':
					deltaX = x1 / box.width;
					deltaY = y2 / box.height;
					break;

				case 'se':
					deltaX = x2 / box.width;
					deltaY = y2 / box.height;
					break;

				case 'nw':
					deltaX = x1 / box.width;
					deltaY = y1 / box.height;
					break;

				case 'ne':
					deltaX = x2 / box.width;
					deltaY = y1 / box.height;
					break;
				}

				if (deltaX >= 0.99) {
					deltaX = 1;
				}

				if (deltaY >= 0.99) {
					deltaY = 1;
				}

				self.state.nodes[self.settings.clickarea - 1][i].deltaX = deltaX;
				self.state.nodes[self.settings.clickarea - 1][i].deltaY = deltaY;
			}
		}
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	moveNonFreezedNodes (self) {
		var nodes = self.state.nodes;
		var dataIndex = self.settings.clickarea - 1;
		var direction = self.state.direction;

		for (let i = 0; i < nodes[dataIndex].length; i++) {
			let node = nodes[dataIndex][i];

			if ('deltaX' in node || 'deltaY' in node) {
				let deltaX = node.deltaX;
				let deltaY = node.deltaY;

				if (direction === 'e' || direction === 'w') {
					node.x += d3.event.dx * deltaX;
				} else if (direction === 'n' || direction === 's') {
					node.y += d3.event.dy * deltaY;
				} else if (direction === 'se' || direction === 'sw' || direction === 'nw' || direction === 'ne') {
					node.x += d3.event.dx * deltaX;
					node.y += d3.event.dy * deltaY;
				}
			}
		}
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createDragBox () {
		const self = this;
		const selected = d3.selectAll('.overlay.selected').node();

		if (selected === null || this.state.viewUpdate === true) return;

		const box = selected.getBBox();

		self.pathBox = d3.selectAll('svg')
			.append('rect')
			.attr('class', 'bbRect')
			.attr('x', box.x)
			.attr('y', box.y)
			.attr('width', box.width)
			.attr('height', box.height)
			.attr('fill', 'none')
			.attr('stroke', '#068DF2')
			.attr('stroke-width', '1');

		d3BBox.d3lb.bbox()
			.infect(d3.selectAll('rect'))
			.directions(['e', 'w', 'n', 's', 'nw', 'ne', 'se', 'sw'])
			.on('resizestart', function (d, i) {
				self.state.direction = self.whichborder(d3.mouse(this), this);
				self.freezeNodes(self, box);
				self.applyFreezedNodes(self, box);
			})
			.on('resizemove', function (d, i) {
				self.moveNonFreezedNodes(self);
				self.update();
			})
			.on('resizeend', function (d, i) {
				for (i = 0; i < self.state.nodes[self.settings.clickarea - 1].length; i++) {
					delete self.state.nodes[self.settings.clickarea - 1][i].deltaX;
					delete self.state.nodes[self.settings.clickarea - 1][i].deltaY;

					if (self.state.tool === 'selectAll') {
						self.pathBox.remove();
						self.createDragBox();
					}
				}
			});
	}

	setFigureState () {
		switch (this.state.tool) {
		case 'pen':
			d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', false);
			d3.select('.handle').on('click mousedown', null);
			if (typeof this.pathBox !== 'undefined') {
				this.pathBox.remove();
			}
			break;
		case 'select':
			if (this.state.shapeIsSelected) {
				d3.selectAll('.overlay' + this.settings.clickarea + ' .handle')
					.classed('invisible', false);
			}
			if (typeof this.pathBox !== 'undefined') {
				this.pathBox.remove();
			}
			break;
		case 'selectAll':
			if (this.state.shapeIsSelected === true || this.state.nodeIsDragged === true) {
				if (typeof this.pathBox !== 'undefined') {
					this.pathBox.remove();
				}
				this.createDragBox();
			}

			d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', true);
			d3.select('.handle').on('click mousedown', null);
			break;
		}
	}

	isBetween (a, b, c, tolerance) {
		//test if the point c is inside a pre-defined distance (tolerance) from the line
		var distance = Math.abs((c.y - b.y) * a.x - (c.x - b.x) * a.y + c.x * b.y - c.y * b.x) / Math.sqrt(Math.pow((c.y - b.y), 2) + Math.pow((c.x - b.x), 2));
		if (distance > tolerance) { return false; }

		//test if the point c is between a and b
		var dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);
		if (dotproduct < 0) { return false; }

		var squaredlengthba = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
		if (dotproduct > squaredlengthba) { return false; }

		return true;
	};


	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	update (props) {
		const self = this;

		this.state.props = props || this.state.props;

		if (typeof this.state.nodes === 'undefined') {
			return;
		}

		for (var i = 0; i < this.state.nodes.length; i++) {
			this.containerCreator();
		}

		self.setFigureState();
		self.createHandles();
		self.createPath();
	}
}
