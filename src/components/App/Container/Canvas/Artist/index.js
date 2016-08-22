import d3 from 'd3';
import $ from 'jquery';
import { Component } from 'react';
import d3BBox from '../../../../../lib/d3bbox';
import './styles/styles.css';

export default class DrawVectors extends Component {

	constructor (el, updateOverlayFn, removeOverlayFn, createOverlayFn, unselectOverlayFn, saveCopyFn, setColorFn, dispatch) {
		super();

		const self = this;
		const svg = d3.selectAll('svg');

		if (svg.length > 0) {
			svg.remove();
		}

		this.state = {
			nodes: [],
			edges: [],
			interpolate: '',
			color: '#6ec2b3',
			shapes: 0,
			tool: 'selectAll',
			angle: 0,
			animating: false,
			tick: 0,
			rotatedAngle: 0,
			animation: false,
			stopAngle: 0,
			opacity: 0.7,
			freezedNodes: [],
			dirs: ['n', 'e', 's', 'w', 'nw', 'ne', 'se', 'sw'],
			handlesize: {'w': 5, 'n': 5, 'e': 5, 's': 5},
			props: null,
			selectedNode: null,
			selectedEdge: null,
			shapeIsSelected: ''
		};

		this.settings = {
			width: 1024,
			height: 570,
			clickarea: 0,
			dispatch: dispatch,
			updateOverlayFn: updateOverlayFn,
			removeOverlayFn: removeOverlayFn,
			createOverlayFn: createOverlayFn,
			unselectOverlayFn: unselectOverlayFn,
			setColorFn: setColorFn,
			saveCopyFn: saveCopyFn,
			selectedClass: 'selected',
			containerclass: 'overlay overlay' + self.state.shapes.toString(),
			nodeRadius: 3,
			deleteKey: 27,
			leftKey: 37,
			upKey: 38,
			rightKey: 39,
			downKey: 40
		};

		this.win = d3.select(window);
		this.svg = svg;
		this.createCanvas(el);
		this.initLineCreator();
		this.bindEvents();
		this.bindDrag();
		this.createGhostRect();
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

	createGhostRect () {
		this.ghostRect = d3.selectAll('svg')
			.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('class', 'ghostRect')
			.attr('fill', 'rgba(255, 255, 255, 0)')
			.attr('width', 1024)
			.attr('height', 570)
			.call(this.dragRect);
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
			.attr('id', 'svg')
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
	showCanvas () {
		d3.selectAll('svg')
			.style({display: 'block'});
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	hideCanvas () {
		d3.selectAll('svg')
			.style({display: 'none'});
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	setState (state, clickareas, nodes, edges) {
		if (typeof nodes !== 'undefined') {
			this.settings.clickarea++;
			this.state.nodes = nodes;
			this.state.edges = edges;
		} else {
			this.state.nodes = state.nodes;
			this.state.edges = state.edges;
		}

		this.state.isSelected = state.isSelected;
		this.state.currentView = state.image;
		this.state.props = clickareas;
		this.state.color = state.color;
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

		this.svgG = this.svg.append('g')
			.classed('overlay overlay' + this.state.shapes.toString(), true);

		let x = d3.mouse(d3.select('svg').node())[0];
		let y = d3.mouse(d3.select('svg').node())[1];

		this.state.nodes.push(
			[
				{interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node1', id: 0, x: x, y: y},
				{interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node2', id: 1, x: x, y: y}
			]
		);

		this.state.edges.push([
			{
				closed: false,
				source: {interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node1', id: 0, x: x, y: y},
				target: {interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node2', id: 1, x: x, y: y}
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

		d3.selectAll('.overlay').classed('selected', false);

		let newG = this.svg.append('g')
			.classed('overlay overlay ' + this.settings.containerclass, true);

		if (index === this.state.shapes - 1) {
			newG.classed('selected', true);
		}

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
			d3.selectAll('.clickarea').attr('fill-opacity', this.state.opacity);
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
	distanceBetweenPoints (p1, p2) {
		return Math.sqrt(Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2));
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	angleBetweenPoints (p1, p2) {
		if (p1[0] === p2[0] && p1[1] === p2[1]) {
			return Math.PI / 2;
		} else {
			return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
		}
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	toDegrees (rad) {
		return rad * (180 / Math.PI);
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

		this.dragRect = d3.behavior.drag()
			.on('drag', function (d) {
				if (d3.selectAll('.resizerect').node() !== null) {
					self.box = d3.selectAll('.resizerect').node().getBBox();
				}

				self.resizeRect
					.attr('stroke', '#fff')
					.attr('x', self.mousedownCoords[0])
					.attr('y', self.mousedownCoords[1])
					.attr('width', function (d) {
						self.box.width = self.box.width += d3.event.dx;
						return self.box.width;
					})
					.attr('height', function (d) {
						self.box.height = self.box.height += d3.event.dx;
						return self.box.height;
					});
			});

		this.dragHandle = d3.behavior.drag()
			.origin(function (d) {
				return {x: d.x, y: d.y};
			})
			.on('dragstart', function (d) {
				if (self.state.tool !== 'select') {
					return;
				}

				d3.event.sourceEvent.preventDefault();
				self.state.nodeIsDragged = true;
			})
			.on('drag', function (d) {
				if (self.state.tool !== 'select') {
					return;
				}

				d3.select(this).classed('selected', true);
				self.dragmove(d);
			})
			.on('dragend', function (d) {
				self.updateClickarea();
			});

		this.dragClickarea = d3.behavior.drag()
			.on('dragstart', function () {
				if (self.state.tool === 'pen' ||
					self.state.tool === 'penRemove' ||
					self.state.tool === 'penAdd') {
					return;
				}

				self.updateClickarea();
				d3.event.sourceEvent.preventDefault();
				d3.select(this).classed('drag', true);
			})
			.on('drag', function (d, i) {
				if (self.mouseup === true) {
					return;
				}

				if (self.state.tool === 'pen' ||
					self.state.tool === 'penRemove' ||
					self.state.tool === 'penAdd') {
					return;
				}

				for (i = 0; i < self.state.nodes[self.settings.clickarea - 1].length; i++) {
					self.state.nodes[self.settings.clickarea - 1][i].x += d3.event.dx;
					self.state.nodes[self.settings.clickarea - 1][i].y += d3.event.dy;
				}

				if (self.state.tool === 'selectAll') {
					$('.bbRect').remove();
					delete self.pathBox;
					if (self.state.animating === false) {
						self.createDragBox();
					}
				}

				self.update();
			})
			.on('dragend', function (d, i) {
				var transform = $('#canvasWrapper').css('transform');
				var matrix = transform.replace(/[^0-9\-.,]/g, '').split(',');
 				var x = matrix[12] || matrix[4];
 				var y = matrix[13] || matrix[5];

				if (x === 0 && y === 0) {
					return;
				}

				if (self.state.tool === 'select' || self.state.tool === 'selectAll') {
					self.updateClickarea();
				}
			});
	}

	svgKeyUp () {
		if (d3.event.shiftKey === false) {
			this.state.shiftKey = false;
		}
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

		if (d3.event.shiftKey === true) {
			this.state.shiftKey = true;
		}

		switch (d3.event.keyCode) {
		case this.settings.deleteKey:
			d3.event.preventDefault();
			if (this.state.shapeIsSelected === true) {
				this.removeFigure();
			}
			break;
		case this.settings.leftKey:
			if (this.state.shapeIsSelected === false) return;
			for (var i = 0; i < this.state.nodes[this.settings.clickarea - 1].length; i++) {
				this.state.nodes[this.settings.clickarea - 1][i].x -= 1;
			}
			this.update();
			break;
		case this.settings.rightKey:
			if (this.state.shapeIsSelected === false) return;
			for (i = 0; i < this.state.nodes[this.settings.clickarea - 1].length; i++) {
				this.state.nodes[this.settings.clickarea - 1][i].x += 1;
			}
			this.update();
			break;
		case this.settings.upKey:
			if (this.state.shapeIsSelected === false) return;
			for (i = 0; i < this.state.nodes[this.settings.clickarea - 1].length; i++) {
				this.state.nodes[this.settings.clickarea - 1][i].y -= 1;
			}
			this.update();
			break;
		case this.settings.downKey:
			if (this.state.shapeIsSelected === false) return;
			for (i = 0; i < this.state.nodes[this.settings.clickarea - 1].length; i++) {
				this.state.nodes[this.settings.clickarea - 1][i].y += 1;
			}
			this.update();
			break;
		}
	}

	createNewRect (rect) {
		const self = this;

		this.state.nodes.push([
			{
				interpolate: this.state.interpolate,
				x: self.settings.width / 2 - (rect.width / 2),
				y: self.settings.height / 2 - (rect.height / 2)
			},
			{
				interpolate: this.state.interpolate,
				x: self.settings.width / 2 - (rect.width / 2),
				y: (self.settings.height / 2) + (rect.height / 2)
			},
			{
				interpolate: this.state.interpolate,
				x: (self.settings.width / 2) + (rect.width / 2),
				y: (self.settings.height / 2) + (rect.height / 2)
			},
			{
				interpolate: this.state.interpolate,
				x: (self.settings.width / 2) + (rect.width / 2),
				y: self.settings.height / 2 - (rect.height / 2)
			}
		]);

		this.state.edges.push([
			{
				closed: true,
				source: {
					interpolate: 'linear',
					x: self.settings.width / 2,
					y: self.settings.height / 2
				},
				target: {
					interpolate: 'linear',
					x: self.settings.width / 2,
					y: (self.settings.height / 2) + rect.height
				}
			},
			{
				closed: true,
				source: {
					interpolate: 'linear',
					x: self.settings.width / 2,
					y: (self.settings.height / 2) + rect.height
				},
				target: {
					interpolate: 'linear',
					x: (self.settings.width / 2) + rect.width,
					y: (self.settings.height / 2) + rect.height
				}
			},
			{
				closed: true,
				source: {
					interpolate: 'linear',
					x: (this.svg.width / 2) + rect.width,
					y: (this.svg.height / 2) + rect.height
				},
				target: {
					interpolate: 'linear',
					x: (this.svg.width / 2) + rect.width,
					y: this.svg.height / 2
				}
			}
		]);

		this.settings.dispatch(this.settings.createOverlayFn('Daniel'));
		this.state.isNew = true;
		this.update();
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removeFigure () {
		d3.selectAll('.overlay' + parseInt(this.settings.clickarea)).remove();
		this.state.nodes.splice(this.settings.clickarea - 1, 1);
		this.state.edges.splice(this.settings.clickarea - 1, 1);
		this.state.shapes--;
		this.state.shapeIsSelected = false;
		this.cleanupElements();
		this.unselectClickarea();
		this.removeClickarea(this.settings.clickarea - 1);
		this.removeBBRect();

		if (this.settings.clickarea > 0) {
			this.settings.clickarea--;
		}

		this.update();
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removePoint (point) {
		this.state.nodes[this.settings.clickarea - 1]
			.splice(this.state.nodes[this.settings.clickarea - 1]
			.indexOf(point), 1);

		this.spliceLinksForNode(point);
		this.state.selectedNode = null;
		this.state.shapeIsSelected = true;
		this.updateClickarea();
		this.update();
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

	createDragRect () {
		this.mousedownCoords = d3.mouse(d3.selectAll('svg').node());

		this.resizeRect = d3.selectAll('svg')
			.append('rect')
			.attr('fill', 'rgba(255, 255, 255, 0)')
			.attr('class', 'resizerect')
			.attr('width', 0)
			.attr('height', 0)
			.style('stroke', 'rgb(6, 141, 242)')
			.style('stroke-width', 1.5);
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	svgMouseDown (d) {
		if (Object.keys(this.state.props.views).length === 0) {
			return;
		}

		d3.event.preventDefault();
		this.state.toolChange = false;
		$('.figureItem').removeClass('layerfill');

		if (d3.event.target.tagName === 'path' && d3.event.target.attributes.d.nodeValue.indexOf('z') > -1) {
			d3.selectAll('.ghostRect').remove();
			return;
		}

		if (this.state.tool === 'rectangle') {
			this.settings.dispatch(this.settings.createOverlayFn('Daniel'));
			this.state.isNew = true;
			this.createDragRect();
		}

		if (this.state.nodes.length === 0 && this.state.tool !== 'pen') {
			return;
		}

		if (d3.event.target.tagName !== 'rect' && this.state.tool !== 'penAdd') {
			if (d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').node() !== null) {
				if (d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').attr('d').indexOf('z') > -1) {
					d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').style('stroke', '#fff');
					d3.selectAll('.overlay').classed('selected', false);
				}
			}
		}

		this.state.mouseDown = true;
		this.state.selectedNode = false;
		this.state.nodeIsDragged = false;
		this.state.viewUpdate = false;
		this.state.multiple = true;

		if (this.state.nodes.length === 0 || this.state.nodes[this.settings.clickarea - 1].length === 0 ||
			d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').attr('d').indexOf('z') > -1 ||
			d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').classed('closed') === true
		) {
			if (this.state.tool === 'pen') {
				this.state.init = true;
				this.state.mouseDown = false;
				this.settings.setColorFn('rgba(255, 255, 255, 0)');
				this.settings.dispatch(this.settings.createOverlayFn('Daniel'));
				d3.selectAll('.clickarea').style('stroke', '#fff');
			}
		}

		if (d3.event.target.tagName !== 'path' && d3.event.target.nodeName !== 'rect') {
			d3.selectAll('.handle').classed('selected', false);

			if (d3.selectAll('.clickarea' + this.settings.clickarea).attr('d').indexOf('z') > -1) {
				delete this.pathBox;
				d3.selectAll('.bbRect').remove();
			}

			if (this.state.tool !== 'pen' && this.state.tool !== 'penAdd') {
				d3.selectAll('.handle').classed('invisible', true);
				d3.selectAll('.bbRect').remove();
				this.state.shapeIsSelected = false;
				this.unselectClickarea();
				delete this.pathBox;
			} else {
				this.state.shapeIsSelected = true;
			}
		}
	}

	createDragRectData () {
		var box = d3.selectAll('.resizerect').node().getBBox();

		box.x = box.x.toFixed(0);
		box.y = box.y.toFixed(1);

		this.state.nodes.push([
			{ interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node1', id: 0, x: box.x, y: box.y },
			{ interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node2', id: 1, x: box.x, y: box.y + box.height },
			{ interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node3', id: 2, x: box.x + box.width, y: box.y + box.height },
			{ interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node3', id: 2, x: box.x + box.width, y: box.y }

		]);

		this.state.edges.push([
			{
				closed: true,
				source: { interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node1', id: 0, x: box.x, y: box.y },
				target: { interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node2', id: 1, x: box.x, y: box.y + box.height }
			},
			{
				closed: true,
				source: { interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node1', id: 0, x: box.x, y: box.y },
				target: { interpolate: this.state.interpolate, clickarea: this.state.shapes, title: 'Node2', id: 1, x: box.x, y: box.y + box.height }
			},
			{
				closed: true,
				source: { clickarea: this.state.shapes, title: 'Node1', id: 0, x: box.x, y: box.y },
				target: { clickarea: this.state.shapes, title: 'Node2', id: 1, x: box.x, y: box.y + box.height }
			}
		]);

		this.settings.clickarea++;
		d3.selectAll('.resizerect').remove();
		this.update();
		this.updateClickarea();
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	svgMouseUp () {
		if (this.state.tool !== 'rectangle') {
			d3.selectAll('.ghostRect').remove();
		}

		if (this.state.tool === 'rectangle') {
			this.createGhostRect();
			this.createDragRectData();
			this.state.isNew = false;
		}

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

			this.addPoint();
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
	addPoint () {
		let nodes = this.state.nodes;
		let edges = this.state.edges;
		let clickarea = this.settings.clickarea - 1;
		let xycoords = d3.mouse(this.svgG.node());

		let node = {
			id: this.idct++,
			clickarea: this.settings.clickarea,
			interpolate: this.state.interpolate,
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
		d3node.classed(this.settings.connectClass, false);

		if (this.state.tool !== 'pen') {
			if (this.state.selectedEdge) {
				this.removeSelectFromEdge();
			}

			let prevNode = this.state.selectedNode;

			if (this.state.tool === 'penRemove') {

			}

			if (!prevNode || prevNode.id !== d.id) {
				//this.replaceSelectNode(d3node, d);
				//this.removePoint(d);
			} else {
				this.removeSelectFromNode();
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
		this.handles.filter((handle) => {
			return handle.id === this.state.selectedNode.id;
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
		this.paths.filter((path) => {
			return path === this.state.selectedEdge;
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
		const edges = this.state.edges;
		const clickarea = this.settings.clickarea - 1;
		const toSplice = edges[clickarea].filter((edge) => {
			return (edge.source === node || edge.target === node);
		});

		toSplice.map((l) => {
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
	closeEdge (i) {
		var nodes = this.state.nodes;
		var edges = this.state.edges;
		var dataIndex = this.settings.clickarea - 1;

		if (i === 0 && nodes[dataIndex].length > 2) {
			if (this.state.tool === 'pen') {
				for (let j = 0; j < edges[dataIndex].length; j++) {
					edges[dataIndex][j].closed = true;
				}

				for (let j = 0; j < nodes[dataIndex].length; j++) {
					nodes[dataIndex][j].closed = true;
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
	makePenAddPoint (self) {
		self = self || this;

		for (var i = 0; i < self.state.nodes[self.settings.clickarea - 1].length; i++) {
			if (i !== self.state.nodes[self.settings.clickarea - 1].length - 1) {
				let isBetween = self.isBetween(self.state.nodes[self.settings.clickarea - 1][i], self.state.nodes[self.settings.clickarea - 1][i + 1], {x: d3.mouse(d3.select('svg').node())[0], y: d3.mouse(d3.select('svg').node())[1]}, 15);

				if (isBetween === true && self.state.tool === 'penAdd') {
					if (self.state.multiple === true) {
						self.state.nodes[self.settings.clickarea - 1].splice(i + 1, 0, {x: d3.mouse(d3.select('svg').node())[0], y: d3.mouse(d3.select('svg').node())[1]});
						self.state.multiple = false;
						self.update();
					}
				}
			} else {
				let isBetween = self.isBetween(self.state.nodes[self.settings.clickarea - 1][i], self.state.nodes[self.settings.clickarea - 1][0], {x: d3.mouse(d3.select('svg').node())[0], y: d3.mouse(d3.select('svg').node())[1]}, 15);

				if (isBetween === true && self.state.tool === 'penAdd') {
					if (self.state.multiple === true) {
						self.state.nodes[self.settings.clickarea - 1].push({interpolate: this.state.interpolate, x: d3.mouse(d3.select('svg').node())[0], y: d3.mouse(d3.select('svg').node())[1]});
						self.state.multiple = false;
						self.update();
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
	createHandles () {
		const self = this;

		this.handle = d3.selectAll('.handles')
			.data(self.state.nodes)
				.selectAll('.handle')
				.data((d) => d);

		this.handle
			.classed('filled', true)
			.attr('transform', function (d) {
				return 'translate(' + d.x + ',' + d.y + ')';
			});

		this.handle
			.enter()
			.append('circle')
			.attr('class', function (d, i) {
				var visible = (d.clickarea === self.settings.clickarea && self.state.isSelected === false) ? '' : 'invisible';

				if (self.state.tool === 'penadd') {
					visible = '';
				}

				return 'handle' + ' ' + 'handle' + parseInt(i + 1) + ' ' + visible;
			})
			.attr('r', String(self.settings.nodeRadius))
			.attr('transform', (d) => {
				return 'translate(' + d.x + ',' + d.y + ')';
			})
			.on('mousedown', function (d, i) {
				self.closeEdge(i);
				self.handleMouseDown(d);
				self.update();

				self.state.nodeIsDragged = false;
				d3.selectAll('.handle').classed('selected', false);

				if (self.state.tool === 'penRemove') {
					self.state.selectedNode = d;
					self.removePoint(d);
				}

				if (self.state.tool !== 'pen') {
					d3.select(this).classed('selected', true);
					self.removeBBRect();
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
	createPath () {
		const self = this;
		var z;

		this.clickareas = d3.selectAll('.path')
			.data(self.state.edges);

		this.clickareas
			.each(function (d, i) {
				d3.selectAll('.clickarea' + parseInt(i + 1)).remove();

				for (var j = 0; j < self.state.nodes[i].length - 1; j++) {
					d3.select(this).style({'fill': self.state.nodes[i][0].color});
				}

				d3.select(this)
					.append('path')
					.attr('class', function (d) {
						return 'clickarea ' + 'clickarea' + parseInt(i + 1);
					})
					.attr('fill', function (d) {
						if (d3.select(this).style('fill') === 'rgb(0, 0, 0)') {
							return 'rgb(110, 194, 179)';
						}
					})
					.attr('fill-opacity', function (d) {
						return (self.state.props.fill === true) ? self.state.opacity : 0;
					})
					.attr('d', function (d, k) {
						if (self.state.nodes[i][0].interpolate === 'linear') {
							interpolate = 'linear';
						} else if (self.state.nodes[i][0].interpolate === 'step-before') {
							interpolate = 'step-before';
						}

						if (self.state.nodes[i][0].interpolate === 'linear' ||
							self.state.nodes[i][0].interpolate === 'step-before') {
							if (d.length === 0) {
								z = 'z';
							} else {
								z = (d[d.length - 1].closed === true) ? 'z' : '';
							}
						} else {
							z = '';

							if (d.length > 0) {
								if (d[0].closed === true) {
									d3.select(this).classed('closed', true);

									if (self.state.nodes[i][0].interpolate === 'basis') {
										var interpolate = 'basis-closed';
									} else if (self.state.nodes[i][0].interpolate === 'cardinal') {
										interpolate = 'cardinal-closed';
									}
								} else {
									d3.select(this).classed('closed', false);
									interpolate = self.state.nodes[i][0].interpolate;
								}
							}
						}

						self.lineCreator.interpolate(interpolate);
						return self.lineCreator(self.state.nodes[i]) + z;
					})
					.style('stroke', function (d, i) {
						if (d.length === 0) {
							if (d[0].closed === false) {
								return 'rgb(6, 141, 242)';
							} else {
								return 'rgb(6, 141, 242)';
							}
						} else {
							var handleClass = d3.selectAll('.overlay' + self.state.shapes + ' .handle').attr('class');

							if (d[d.length - 1].closed === false ||
								d[i].source.clickarea === self.settings.clickarea &&
								handleClass.indexOf('invisible') === -1) {
								return 'rgb(6, 141, 242)';
							} else {
								return '#fff';
							}
						}
					})
					.on('click', function (d, i) {
						if (self.state.tool === 'pen') {
							return;
						}
						d3.select(this).classed('selected', true);
					})
					.on('mousedown', function () {
						self.state.multiple = true;
						self.mousedown = true;
						self.mouseup = false;

						if (self.state.tool === 'pen') {
							return;
						}

						d3.selectAll('.overlay' + self.settings.clickarea).classed('selected', true);
						d3.selectAll('.handle').classed('selected', false);

						self.settings.clickarea = parseInt(
							d3.select(this).attr('class')
								.replace('clickarea', '')
								.replace('clickarea', '')
						);

						self.state.shapeIsSelected = true;

						d3.selectAll('.bbRect').classed('inactive', true);
						d3.selectAll('.overlay').classed('selected', false);
						d3.selectAll('.overlay' + parseInt(self.settings.clickarea)).classed('selected', true);

						if (self.state.tool === 'selectAll') {
							d3.selectAll('.bbRect.inactive').remove();
						}
					})
					.on('mouseup', function (d) {
						self.mouseup = true;
						self.mousedown = false;

						d3.selectAll('.overlay' + parseInt(self.settings.clickarea) + ' .handle').classed('selected', false);
						self.state.color = d3.select('.overlay' + self.settings.clickarea + ' .path').style('fill');
						self.settings.dispatch(self.settings.setColorFn(d3.select('.overlay' + self.settings.clickarea + ' .path').style('fill')));
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
					.attr('class', 'clickarea')
					.attr('d', function (d, i) {
						self.lineCreator.interpolate(self.state.nodes[i][0].interpolate);
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
		var bbox = d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').node().getBBox();
		var scope = (this.state.shapeIsSelected === true) ? 'figure' : 'project';

		this.state.pathData = d3.selectAll('.clickarea' + this.settings.clickarea).node().attributes.getNamedItem('d').value;

		this.settings.dispatch(
			this.settings.updateOverlayFn(
				this.state.pathData,
				this.settings.clickarea - 1,
				this.state.currentView,
				this.state.nodes,
				this.state.edges,
				this.state.shapeIsSelected,
				bbox,
				scope
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
	unselectClickarea (index) {
		this.settings.dispatch(
			this.settings.unselectOverlayFn()
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

	saveCopy () {
		this.settings.dispatch(
			this.settings.saveCopyFn(
				{
					nodes: this.state.nodes[this.settings.clickarea - 1],
					edges: this.state.edges[this.settings.clickarea - 1]
				}
			)
		);
	}

	pasteClickarea (nodes, edges) {
		this.state.nodes.push(nodes);
		this.state.edges.push(edges);
		this.update();
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
		// Bestäm vilka noder som ska vara orörliga
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
	moveNonFreezedNodes (self, box) {
		let nodes = self.state.nodes;
		let dataIndex = self.settings.clickarea - 1;
		let direction = self.state.direction;

		for (let i = 0; i < nodes[dataIndex].length; i++) {
			let node = nodes[dataIndex][i];

			if ('deltaX' in node || 'deltaY' in node) {
				let deltaX = node.deltaX;
				let deltaY = node.deltaY;
				self.scaleFigure(direction, deltaX, deltaY, node, self);
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
	scaleFigure (direction, deltaX, deltaY, node, self) {
		// scale horizontal / vertical
		if (direction === 'e' || direction === 'w') {
			node.x += d3.event.dx * deltaX;
		} else if (direction === 'n' || direction === 's') {
			node.y += d3.event.dy * deltaY;
		// scale diagonaly
		} else if (direction === 'se' || direction === 'sw' || direction === 'nw' || direction === 'ne') {
			// scale diagonaly and lock ratio
			if (self.state.shiftKey === true) {
				if (direction === 'se' || direction === 'nw') {
					node.x += (d3.event.dy * deltaX) * self.state.ratio;
					node.y += d3.event.dy * deltaY;
				} else if (direction === 'ne' || direction === 'sw') {
					node.x += (d3.event.dy * deltaX) * -(self.state.ratio);
					node.y += d3.event.dy * deltaY;
				}
			} else {
				node.x += d3.event.dx * deltaX;
				node.y += d3.event.dy * deltaY;
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
		self.state.resizeBBox = box;

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

				if (box.width / box.height) {
					self.state.ratio = box.width / box.height;
				} else {
					self.state.ratio = box.height / box.width;
				}

				self.freezeNodes(self, box);
				self.applyFreezedNodes(self, box);
			})
			.on('resizemove', function (d, i) {
				self.moveNonFreezedNodes(self);
				self.update();
			})
			.on('resizeend', function (d, i) {
				self.state.resizeBBox = d3.selectAll('.overlay.selected').node().getBBox();

				for (i = 0; i < self.state.nodes[self.settings.clickarea - 1].length; i++) {
					delete self.state.nodes[self.settings.clickarea - 1][i].deltaX;
					delete self.state.nodes[self.settings.clickarea - 1][i].deltaY;
				}
			});
	}

	setFigureState () {
		switch (this.state.tool) {
		case 'pen':
			if (d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').node() !== null) {
				if (d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').attr('d').indexOf('z') === -1) {
					d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', false);
				}
			}
			d3.select('.handle').on('click mousedown', null);
			this.removeBBRect();
			break;
		case 'penAdd':
			if (this.state.shapeIsSelected === true) {
				d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').style('stroke', 'rgb(6, 141, 242)');
				d3.selectAll('.overlay .handle').classed('invisible', true);
				d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', false);
			}

			if (this.state.toolChange === false) {
				d3.select('.handle').on('click mousedown', null);
			}

			this.removeBBRect();
			break;

		case 'penRemove':
			if (this.state.shapeIsSelected === true) {
				d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').style('stroke', 'rgb(6, 141, 242)');
				d3.selectAll('.overlay .handle').classed('invisible', true);
				d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', false);
			}

			if (this.state.toolChange === false) {
				d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', false);
				d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').style('stroke', 'rgb(6, 141, 242)');
			}
			this.removeBBRect();
			break;

		case 'select':
			if (this.state.shapeIsSelected) {
				d3.selectAll('.clickarea').style('stroke', '#fff');
				d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').style('stroke', 'rgb(6, 141, 242)');
				d3.selectAll('.handle').classed('invisible', true);
				d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', false);
			}
			if (typeof this.pathBox !== 'undefined') {
				this.pathBox.remove();
			}

			break;
		case 'selectAll':
			if (this.state.shapeIsSelected === true || this.state.nodeIsDragged === true) {
				this.removeBBRect();
				d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', true);

				if (this.state.animating === false) {
					this.createDragBox();
				}
			}

			if (this.state.shapeIsSelected) {
				d3.selectAll('.clickarea').style('stroke', '#fff');
				d3.selectAll('.overlay' + this.settings.clickarea + ' .clickarea').style('stroke', 'rgb(6, 141, 242)');
				d3.selectAll('.overlay' + this.settings.clickarea + ' .handle').classed('invisible', true);
			}

			d3.select('.handle').on('click mousedown', null);
			break;
		}
	}

	isBetween (a, b, c, tolerance) {
		var distance = Math.abs((c.y - b.y) * a.x - (c.x - b.x) * a.y + c.x * b.y - c.y * b.x) / Math.sqrt(Math.pow((c.y - b.y), 2) + Math.pow((c.x - b.x), 2));
		if (distance > tolerance) { return false; }

		var dotproduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);
		if (dotproduct < 0) { return false; }

		var squaredlengthba = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
		if (dotproduct > squaredlengthba) { return false; }

		return true;
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	rotateAxis (originX, originY, pointX, pointY, angle) {
		angle = angle * Math.PI / 180.0;
		var nx = Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX;
		var ny = Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY;
		return [nx, ny];
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	rotateFigure () {
		const self = this;

		d3.select('.rotateBtn').on('click', function () {
			var nAngle = $('.rotatefield').val();

			d3.selectAll('.bbRect').remove();
			self.state.animating = true;

			d3.selectAll('.overlay' + self.settings.clickarea)
				.transition()
				.duration(parseInt($('#rotateSpeed').val()) * 1000)
				.attrTween('transform', function (d, i, a) {
					return d3.interpolateString(
						'rotate(0' + ' ' + (self.box.x + self.box.width / 2) + ' ' + (self.box.y + self.box.height / 2) + ')',
						'rotate(' + nAngle + ' ' + (self.box.x + self.box.width / 2) + ' ' + (self.box.y + self.box.height / 2) + ')'
					);
				})
				.each('end', function () {
					for (var i = 0; i < self.state.nodes[self.settings.clickarea - 1].length; i++) {
						d3.select('.overlay' + self.settings.clickarea)
							.attr('transform', 'none');

						var newCoords = self.rotateAxis(
							self.box.x + (self.box.width / 2),
							self.box.y + (self.box.height / 2),
							self.state.nodes[self.settings.clickarea - 1][i].x,
							self.state.nodes[self.settings.clickarea - 1][i].y,
							nAngle
						);

						self.state.nodes[self.settings.clickarea - 1][i].x = Math.round(newCoords[0]);
						self.state.nodes[self.settings.clickarea - 1][i].y = Math.round(newCoords[1]);
					}

					self.updateClickarea();
					self.state.animating = false;
					self.update();
				});
		});
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	update (props) {
		this.state.props = props || this.state.props;

		if (this.state.tool === 'stepBefore' ||
			this.state.tool === 'bezier' ||
			this.state.tool === 'cardinal'
		) {
			this.state.tool = 'pen';
		}

		if (typeof this.state.nodes === 'undefined' ||
			this.state.nodes.length === 0) {
			return;
		}

		for (var i = 0; i < this.state.nodes.length; i++) {
			this.containerCreator();
		}

		if (d3.selectAll('.overlay' + this.settings.clickarea).node() !== null) {
			this.box = d3.selectAll('.overlay' + this.settings.clickarea).node().getBBox();
		}

		this.createHandles();
		this.createPath();
		this.setFigureState();
		this.rotateFigure();
	}
}
