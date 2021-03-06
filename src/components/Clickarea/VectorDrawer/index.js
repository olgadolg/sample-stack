import d3 from 'd3';
import $ from 'jquery'
import React, { Component } from 'react';
import './styles/styles.css';

export default class DrawVectors extends Component {

	constructor(el, updateClickareaFn, removeClickareaFn, dispatch) {
		super();

		const self = this;

		this.state = {
			nodes: [],
			edges: [],
			views: [],
			shapes: 0,
			props: null,
			coords: null,
			remove: false,
			selectedNode: null,
			selectedEdge: null,
			mouseDown: false,
			shapeIsSelected: false,
			multipleSelection: false,
			multipleHandles: [],
			allowedToCreateNew: false,
		};

		this.settings = {
			width: 1024,
			height: 570,
			clickarea: 0,
			isCreating: false,
			dispatch: dispatch,
			updateClickareaFn: updateClickareaFn,
			removeClickareaFn: removeClickareaFn,
			selectedClass: "selected",
			containerclass: "overlay overlay" + self.state.shapes.toString(),
			backspace_key: 8,
			delete_key: 46,
			alt_key: 18,
			nodeRadius: 5
		};

		this.win = d3.select(window);
		this.svg = d3.select(el)
			.append('svg')
			.attr({ 
				height: self.settings.height, 
				width: self.settings.width 
			});

		this.rect = this.svg
			.append("path")
			.classed('init-rect', true)
			.attr("fill", '#6EC2B3')
			.attr("d", function(d) {
				return self.rightRoundedRect(-80, 0, 80, 133, 5);
			})

		this.lineCreator = d3.svg.line()
			.x(function(d, i) { return d.x; })
			.y(function(d) { return d.y; })

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
	endTransition(transition, callback) {

		if (transition.empty()) {
			callback();
		
		} else {
			let n = transition.size();
			transition.each("end", function () {
				n--;
		
				if (n === 0) {
		 			callback();
				}
			});
		}
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	rightRoundedRect(x, y, width, height, radius) {

		return "M" + x + "," + y
			+ "h" + (width - radius)
			+ "a" + 0 + "," + 0 + " 0 0 1 " + 0 + "," + 0
			+ "v" + height
			+ "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
			+ "h" + (radius - width)
			+ "z";
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	animateNewClickarea(x, y, duration, delay, bounce, callback) {

		callback = callback || function() {};

		const self = this;

		d3.select('.init-rect')
			.transition()
			.ease(bounce)
			.attr("transform", "translate(" + x + "," + y + ")")
			.delay(delay)
			.duration(duration)
			.call(self.endTransition, function () {
				callback(self)
			});
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createClickarea(self) {
		self.state.shapes++;
		self.settings.isCreating = true;
		self.settings.clickarea = self.state.shapes;
		self.state.shapeIsSelected = true;

		d3.selectAll('.handle').classed('invisible', true);

		self.svgG = self.svg
			.append("g")
			.classed('overlay overlay' + self.state.shapes.toString(), true);

		self.state.nodes.push(
			[
				{clickarea: self.state.shapes, title: "Node1", id: 0, x: 40, y: 30},
				{clickarea: self.state.shapes, title: "Node2", id: 1, x: 40, y: 105}
				
			]
		);

		self.state.edges.push([
			{
				closed: false,
				source: {clickarea: self.state.shapes, title: "Node1", id: 0, x: 40, y: 30},
				target: {clickarea: self.state.shapes, title: "Node2", id: 1, x: 40, y: 105}
			}
		]);

		self.createGroups();
		self.update();
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createContainer(index) {
		var newG;

		this.state.shapes++;
		this.settings.containerclass = 'overlay' + this.state.shapes;
		
		newG = this.svg.append("g")
			.classed('overlay overlay ' + this.settings.containerclass, true)
		
		this.svgG = newG;
		
		this.path = newG.append("g")
			.attr('class', 'path')
			.selectAll("g");
		
		this.handles = newG.append("g")
			.attr('class', 'handles')
			.selectAll("g");
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	toggleFill() {
		if (this.state.fill == true) {
			d3.selectAll('.clickarea').attr('fill-opacity', 0);
			this.fill = false;
		} else {
			d3.selectAll('.clickarea').attr('fill-opacity', 0.7);
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
	createGroups() {
		this.path = this.svgG
			.append("g")
			.attr('class', 'path')
			.selectAll("g");

		this.handles = this.svgG
			.append("g")
			.attr('class', 'handles')
			.selectAll("g");
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	bindEvents() {
		const self = this;

		this.svg
			.on("mousedown", function(d) { self.svgMouseDown.call(self, d); })
			.on("mouseup", function(d) { self.svgMouseUp.call(self, d); })

		this.win
			.on("keydown", function() {
				self.svgKeyDown.call(self);
			})
			.on("keyup", function() {
				self.svgKeyUp.call(self);
			});
	}

	/**
	 * Triggers on theme selected
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	bindDrag() {
		const self = this;

		this.dragHandle = d3.behavior.drag()
			.origin(function(d) {
				return {x: d.x, y: d.y}
			})
			.on('dragstart', function() {
				self.animateNewClickarea(0, 0, 750, 500, "none");
			})
			.on("drag", function(d) {
				d3.select(this).classed('selected', true);
				self.dragmove.call(self, d);
			})
			.on('dragend', function(d) {
				self.updateClickarea();

				if (d3.select(this).classed('selected') == false) {
					self.state.shapeIsSelected = true;
				}
			});

		this.dragClickarea = d3.behavior.drag()
			.on('dragstart', function() {
				self.animateNewClickarea(0, 0, 750, 500, "none");
			})
			.on('drag', function(d, i) {
				for (var i = 0; i < self.state.nodes[self.settings.clickarea -1].length; i++) {
					self.state.nodes[self.settings.clickarea -1][i].x += d3.event.dx;
					self.state.nodes[self.settings.clickarea -1][i].y += d3.event.dy;
				}
				self.update();
			})
			.on('dragend', function(d, i) {
				self.state.allowedToCreateNew = true;
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
	svgKeyDown() {
		const
			selectedNode = this.state.selectedNode,
			selectedEdge = this.state.selectedEdge;

		if (this.state.multipleSelection == true) {
			return;
		}

		switch(d3.event.keyCode) {
			case this.settings.alt_key:
				d3.selectAll('.handle').classed(this.settings.selectedClass, false);
				this.state.multipleSelection = true;
			break;

			case this.settings.backspace_key:
			case this.settings.delete_key:

				d3.event.preventDefault();

				if (this.state.shapeIsSelected === true) {
					if (confirm('Are you sure you want to remove this clickarea?')) {
						d3.selectAll('.overlay' + parseInt(this.settings.clickarea)).remove()
						this.state.nodes.splice(this.settings.clickarea -1, 1);
						this.state.edges.splice(this.settings.clickarea -1, 1);
						this.state.remove = true;
						this.state.shapes--;
						this.state.shapeIsSelected = false;
						this.state.multipleHandles = [];
						this.update();
						this.cleanupElements();
						this.removeClickarea(this.settings.clickarea -1);
					}

				} else if (selectedNode) {
					if (confirm('Are you sure you want to remove this point?')) {
						this.state.nodes[this.settings.clickarea -1]
							.splice(this.state.nodes[this.settings.clickarea -1]
							.indexOf(selectedNode), 1);

						this.spliceLinksForNode(selectedNode);
						this.state.selectedNode = null;
						this.state.shapeIsSelected = true;
						this.state.multipleHandles = [];
						this.update();
						this.updateClickarea();
					}
				}

			break;
		}
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	cleanupElements() {
		var el;

		$('.clickarea' + parseInt(this.settings.clickarea)).remove()

		for (let i = 0; i < $('.clickarea').length; i++) {
			el = $('.clickarea')[i];

			$(el)
				.removeClass()
				.addClass('clickarea')
				.addClass('clickarea' + parseInt(i + 1))
		}

		for (var i = 0; i < $('.overlay').length; i++) {
			el = $('.overlay')[i];

			$(el)
				.removeClass()
				.addClass('overlay')
				.addClass('overlay' + parseInt(i + 1))
		}
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	svgKeyUp() {
		this.state.multipleSelection = false;
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	svgMouseDown(d) {
		var
			item,
			edge;

		this.state.mouseDown = true;
		this.state.selectedNode = false;

		if (d3.event.target.tagName != 'path' && this.state.multipleSelection === false) {
			d3.selectAll('.handle').classed('selected', false);

			if (!d3.event.shiftKey) {
				d3.selectAll('.handle').classed('invisible', true);
				this.state.shapeIsSelected = false;
			}

		} else if (this.state.multipleSelection == true && this.state.multipleHandles.length == 2) {
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
	multipleDataUpdate() {
		var
			isClosed = false,
			edge,
			node;

		d3.selectAll('.handle').classed('selected', false);

		for (let i = 0; i < this.state.edges[this.settings.clickarea -1].length; i++) {
			if (this.state.edges[this.settings.clickarea -1][i].closed == true) {
				isClosed = true;
			}
		}

		node = {
			clickarea: this.settings.clickarea,
			id: this.state.nodes[parseInt(this.settings.clickarea -1)].length,
			x: d3.mouse(d3.select('svg').node())[0],
			y: d3.mouse(d3.select('svg').node())[1]
		}

		edge = {
			closed: isClosed,
			source: null,
			target: null,
		}

		if (this.state.multipleHandles[0] === 0 && this.state.multipleHandles[1] !== 1) {
			this.state.nodes[parseInt(this.settings.clickarea -1)].push(node);
		} else {
			this.state.nodes[parseInt(this.settings.clickarea -1)].splice(this.state.multipleHandles[1], 0, node);
		}

		this.state.edges[parseInt(this.settings.clickarea -1)].push(edge);

		for (let i = 0; i < this.state.edges[this.settings.clickarea -1].length; i++) {
			for (let j = 0; j < this.state.nodes[this.settings.clickarea -1].length; j++) {
				if (j == i) {
					this.state.edges[this.settings.clickarea -1][i].source = this.state.nodes[this.settings.clickarea -1][j];
					this.state.edges[this.settings.clickarea -1][i].target = this.state.nodes[this.settings.clickarea -1][j+1];
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
	svgMouseUp() {
		var
			xycoords,
			d;

		if (this.state.mouseDown && d3.event.shiftKey) {

			if (this.settings.clickarea == null) {
				return;
			}

			xycoords = d3.mouse(this.svgG.node()),
			
			d = {
				id: self.idct++,
				clickarea: this.settings.clickarea,
				x: xycoords[0], 
				y: xycoords[1]
			};

			this.state.allowedToCreateNew = true;
			this.animateNewClickarea(0, 0, 750, 500, "none");
			this.state.nodes[this.settings.clickarea -1].push(d);
			this.updateClickarea();
			this.update();
		}
		
		this.state.mouseDown = false;
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	handleMouseDown(d3node, d) {
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
	handleMouseUp(d3node, d, props) {
		const self = this;

		var
			mouseDownNode,
			newEdge,
			filtRes,
			prevNode;
	
		d3node.classed(this.settings.connectClass, false);

		if (!d3.event.shiftKey) {
			if (self.state.selectedEdge) {
				self.removeSelectFromEdge();
			}
			
			prevNode = self.state.selectedNode;

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
	replaceSelectNode(d3Node, nodeData, props) {
		this.state.shapeIsSelected = false;
		
		if (this.state.selectedNode) {
			this.removeSelectFromNode(props);
		}

		this.state.selectedNode = nodeData;
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	replaceSelectEdge(d3Path, edgeData, props) {
		this.state.shapeIsSelected = false;
		d3Path.classed(this.settings.selectedClass, true);

		if (this.state.selectedEdge) {
			this.removeSelectFromEdge();
		}
		
		this.state.selectedEdge = edgeData;
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removeSelectFromNode() {
		const self = this;

		this.handles
			.filter(function(handle) {
				return handle.id === self.state.selectedNode.id;
			})
			.classed(this.settings.selectedClass, false);
		
		this.state.selectedNode = null;
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removeSelectFromEdge() {
		const self = this;

		this.paths
			.filter(function(path) {
				return path === self.state.selectedEdge;
			})
			.classed(this.settings.selectedClass, false);

		this.state.selectedEdge = null;
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	spliceLinksForNode(node) {
		const 
			self = this,
			toSplice = this.state.edges[this.settings.clickarea -1].filter(function(edge) {
				return (edge.source === node || edge.target === node);
			});

			toSplice.map(function(l) {
				self.state.edges[self.settings.clickarea -1].splice(self.state.edges[self.settings.clickarea -1].indexOf(l), 1);
			});

			d3.selectAll('.handle').classed('selected',false);
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	dragmove(d) {
		d.x += d3.event.dx;
		d.y +=  d3.event.dy;

		this.update();
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	zoomed(e) {
		this.zoomedEl = d3.select(".overlay" + self.selectedGraph.toString())
			.attr("transform", function(d) {
				return "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")";
			})
	};

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	handleMultipleClick(i) {
		const path = d3.selectAll('.clickarea' + this.state.shapes).attr('d');

		if (this.state.multipleSelection) {
			if (this.state.multipleHandles.length < 2) {

				if (this.state.multipleHandles.length == 0) {
					this.state.multipleHandles.push(i);
				} else {
					if (this.state.multipleHandles.indexOf(i - 1) > -1 || 
						this.state.multipleHandles.indexOf(i + 1) > -1 ||

						i == 0 && this.state.multipleHandles.indexOf(this.state.nodes[this.settings.clickarea -1].length -1) > -1 && path.indexOf('z') > -1 ||
						i == this.state.nodes[this.settings.clickarea -1].length -1 && this.state.multipleHandles.indexOf(0) > -1 && path.indexOf('z') > -1 &&
						this.state.multipleHandles.indexOf(i) == -1) {

						this.state.multipleHandles.push(i);
					
					} else {
						this.state.multipleHandles[0] = i;
						delete this.lastHandleClicked;
					}
				}

			} else {
				if (this.state.multipleHandles[1] == i -1 || this.state.multipleHandles[1] == i +1) {
					this.state.multipleHandles[0] = this.state.multipleHandles[1];
					this.state.multipleHandles[1] = i;
				
				} else {
					this.state.multipleHandles = [];
					this.state.multipleHandles[0] = i;
					delete this.lastHandleClicked;
				}
			}

		} else {
			this.state.multipleHandles = [];
		}

		this.state.multipleHandles.sort();
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	closeEdge(i) {
		if (i === 0 && this.state.nodes[this.settings.clickarea -1].length > 2 && 
			this.state.multipleSelection === false) {
			if (d3.event.shiftKey=== true) {
				for (let j = 0; j < this.state.edges[this.settings.clickarea -1].length; j++) {
					this.state.edges[this.settings.clickarea -1][j].closed = true;
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
	createHandles() {
		const self = this;

		// data selection - handles
		this.handle = d3.selectAll('.handles')
			.data(self.state.nodes)
			.selectAll('.handle')
				.data(function(d, i){
					return d;
			})

		// update handles
		this.handle
			.classed('filled', true)
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		// create new handles
		this.handle
			.enter()
			.append('circle')
			.attr('class', function(d, i) {
				let fill = self.state.fill == true ? 'filled' : 'filled';
				const visible = (d.clickarea == self.settings.clickarea) ? '' : 'invisible';
				return 'handle' + ' ' + 'handle' + parseInt(i + 1) + ' ' + visible + ' ' + fill; 
			})
			.attr("r", String(self.settings.nodeRadius))
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
			.on("mousedown", function(d, i) {

				if (d3.select('.clickarea' + self.settings.clickarea).attr('d').indexOf('z') > -1) {
					self.state.shapeIsSelected = false;
				}

				self.closeEdge(i);
				self.handleMultipleClick(i);
				
				d3.selectAll('.handle').classed('selected', false);

				if (d3.event.shiftKey == false) {
					d3.select(this).classed('selected', true);
				}

				if (self.state.multipleSelection == true) {
					if (typeof self.lastHandleClicked != "undefined" && self.state.multipleHandles.length == 2) {
						d3.select(self.lastHandleClicked.node()).classed(self.settings.selectedClass, true);
						d3.select(this).classed(self.settings.selectedClass, true);
					}

					self.lastHandleClicked = d3.select(this);
				}

				self.handleMouseDown.call(self, d3.select(this), d);
				self.update();
			})
			.on("mouseup", function(d) {
				self.handleMouseUp.call(self, d3.select(this), d);
			})
			.call(self.dragHandle)

		// remove old circles
		this.handle
			.exit()
			.remove();
	}

	/**
	 * remove edges associated with a node
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	createPath() {
		const self = this;
			
		var z;

		// data selection
		this.clickareas = d3.selectAll('.path')
			.data(self.state.edges)

		// update state.shapes
		this.clickareas
			.each(function(d, i) {
				d3.selectAll(".clickarea" + parseInt(i + 1)).remove();

				d3.select(this)
					.append('path')
					.attr('data-id', function(d) {
						if (self.state.props.views[self.state.currentView].clickareas.length > 0) {
							return self.state.props.views[self.state.currentView].clickareas[i].goTo;
						}
					})
					.attr("class", function(d) { return "clickarea " + "clickarea" + parseInt(i + 1)
					 })
					.attr("fill-opacity", function(d) {
						if (self.state.props.fill === true) {
							return 0.7;
						} else {
							return 0;
						}
					})
					.attr('d', function(d, k) {

						if (d.length === 0) {
							z = 'z';
						} else {
							z = (d[d.length -1].closed === true) ? 'z' : '';
						}

						return self.lineCreator(self.state.nodes[i]) + z
					})
					.on("mousedown", function() {

						if (self.state.multipleHandles.length < 2) {
							self.state.multipleHandles = [];
						}

						self.settings.clickarea = parseInt(
							d3.select(this)
								.attr('class')
									.replace('clickarea', '')
									.replace('clickarea', '')
						)

						d3.select(this).classed('selected', true);
						d3.selectAll('.handle').classed('invisible', true);

						d3.selectAll('.overlay' + parseInt(self.settings.clickarea) + ' .handle')
							.classed('invisible selected', false);

						self.state.shapeIsSelected = true;
					})
					.call(self.dragClickarea)
				});

		// create new state.shapes
		this.clickareas
			.enter()
			.append('g')
			.each(function(d, i) {
				d3.select(this)
					.append('path')
					.attr("class", "clickarea")
					.attr('d', function(d, i) {
						return self.lineCreator(self.state.nodes[i])
					})
					.on("click", function() {
						d3.select(this)
							.classed(self.settings.selectedClass, true)
					}
					.call(self.dragClickarea)
				)
			})

		// remove old state.shapes
		this.clickareas
			.exit()
			.remove();
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	containerCreator() {
		if (this.state.mouseDown === false && this.settings.isCreating == false && this.state.remove == false) {
			for (let i = 0; i < this.state.edges.length; i++) {
				if (i != 0) {
					this.createContainer(i);
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
	updateClickarea() {
		this.state.pathData = d3.select('.clickarea' + this.settings.clickarea).attr('d');
		this.settings.dispatch(this.settings.updateClickareaFn(this.state.pathData, this.settings.clickarea -1, this.state.currentView))
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	removeClickarea(index) {
		this.settings.dispatch(this.settings.removeClickareaFn(index))
	}

	/**
	 * update elements
	 *
	 * @method onThemeSelected
	 * @param {object} event - event
	 * @return void
	 */
	update(props) {
		const self = this;

		this.state.props = props || this.state.props;

		this.containerCreator();
		self.createHandles();
		self.createPath();
	}
}