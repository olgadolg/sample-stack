/*global define, Modernizr, setTimeout, _*/

define(["jquery"], function ($) {

	"use strict";
	var Tooltip = function(el, polygonizr) {

		/**
		 * Constructor function
		 *
		 * @method init
		 * @return void
		 */
		var init = function() {
			this.current = polygonizr.current;
			return this.initNode();
		},

	   /**
		 * Initializes tooltip
		 *
		 * @method initNode
		 * @return (node) node - tooltip element
		 */
		initNode = function() {

			var node = $("<div>");

			if (Modernizr.touchevents) {
				node.css({
					"display":  "none"
				});
			} else {
				node.css({
					"position": "absolute",
					"display":  "none"
				});
			}

			if (Modernizr.touchevents) {
				node.attr("class", "nv-tooltip s mobile")
				.attr("id", "tooltip");

				$("#navigator").append(node);
			} else {
				node.attr("class", "nv-tooltip s")
				 .attr("id", "tooltip");
				
				$(el).append(node);
			}

			this.tooltipEl = node;
			return node;
		},

	   /**
		 * Creates tooltips onLoad
		 *
		 * @method nodeOnload
		 * @return void
		 */
		nodeOnload = function(data, coords, that, wCanvas, hCanvas) {

			if (el.find(".object-wrapper").length === 1) {
				return;
			}

			var node = $("<div>"), minKey;

			node.html(data.tpl)
				.css({"position": "absolute", "display": "none"})
				.attr("class", "nv-tooltip init n")
				.attr("data-id", data.aptId.replace("view:", ""));


			$(el).append(node);

			minKey = this.position(that, hCanvas, wCanvas);
			this.direction(that, minKey, node);

			setTimeout(function() {
				node.show();
			}, 1000);
		},

	   /**
		 * Calculates correct position
		 *
		 * @method direction
		 * @return {node} el - tooltip element
		 */
		direction = function(target, minKey, el) {
			var
				self = this,
				el = el || $(this.tooltipEl),
				BB = this.BBox,
				margins = {
					top:    6,
					bottom: 9,
					left:   10,
					right:  10
				};

			if (this.path === true) {
				BB = {
					x: self.BBox.x * self.scaleFactor,
					y: self.BBox.y * self.scaleFactor,
					width: self.BBox.width * self.scaleFactor,
					height: self.BBox.height * self.scaleFactor
				};
			}

			el = $(el);
			el.removeClass("s e n w");

			if (!this.current.hasOwnProperty('interlink')) {

				switch (minKey) {
					case "top":
						el.css({
							"left": (BB.x + BB.width / 2 - el.width() / 2) + "px",
							"top":  BB.y + BB.height + margins.bottom + "px"
						  }).addClass("s");
					break;

					case "left":
						el.css({
							"left": BB.x + BB.width + margins.right + "px",
							"top":  BB.y + BB.height / 2 - el.height() / 2 + "px"
						  }).addClass("e");
					break;

					case "bottom":
						el.css({
							"left": BB.x + BB.width / 2 - el.width() / 2 + "px",
							"top":  BB.y - el.height() - margins.top + "px"
						}).addClass("n");
					break;

					case "right":

						el.css({
							"left": BB.x - el.width() - margins.left + "px",
							"top":  BB.y + BB.height / 2 - el.height() / 2 + "px"
						}).addClass("w");
					break;
				}

			} else {

				switch (minKey) {
					case "top":
						el.css({
							"left": (BB.x + BB.width / 2 - el.width() / 2) + "px",
							"top":  BB.y + BB.height + margins.bottom + "px"
						  }).addClass("s");
					break;

					case "left":
						el.css({
							"left": BB.x + BB.width + margins.right + "px",
							"top":  BB.y + BB.height / 2 - el.height() / 2 + "px"
						  }).addClass("e");
					break;

					case "bottom":
						el.css({
							"left": BB.x + BB.width / 2 - el.width() / 2 + "px",
							"top":  BB.y - el.height() - margins.top + "px"
						}).addClass("n");
					break;

					case "right":

						el.css({
							"left": BB.x - el.width() - margins.left + "px",
							"top":  BB.y + BB.height / 2 - el.height() / 2 + "px"
						}).addClass("w");
					break;
				}

					/*
					
					switch (minKey) {
						case "top":
							el.css({
								"left": BB.x + BB.width / 2 - el.width() / 2 + "px",
								"top":  BB.y + BB.height / 2 + margins.bottom + "px"
							  }).addClass("s");
						break;

						case "left":
							el.css({
								"left": BB.x + BB.width / 2 + margins.right + "px",
								"top":  BB.y + BB.height / 2 - el.height() / 2 + "px"
							  }).addClass("e");
						break;

						case "bottom":
							el.css({
								"left": BB.x + (polyBBox.width / 2) - margins.top + "px",
								"top":  BB.y + (polyBBox.height / 2) - margins.top + "px"
							}).addClass("n");
						break;

						case "right":
							el.css({
								"left": BB.x - (el.width() / 2) - margins.left + "px",
								"top":  BB.y + (BB.height / 2) - el.height() / 2 + "px"
							}).addClass("w");
						break;
					}
					*/
				}


			return el;
		},

	   /**
		 * Positions tooltip
		 *
		 * @method position
		 * @return void
		 */
		position = function(target, hCanvas, wCanvas, path) {

			var
				height = Math.round(hCanvas),
				width = Math.round(wCanvas),
				elHeight = Math.round(target.getBBox().height),
				elWidth = Math.round(target.getBBox().width),
				top = Math.round(target.getBBox().y),
				left = Math.round(target.getBBox().x),
				bottom = Math.round(height - top - elHeight),
				right = Math.round(width - left - elWidth),

				canvasMargs = {
					left:   left,
					right:  right,
					top:    top,
					bottom: bottom
				};

				if (this.current.hasOwnProperty('interlink')) {
					delete canvasMargs.left;
					delete canvasMargs.right;
				}

			var 
				inverted = _.invert(canvasMargs),
				min = _.min(canvasMargs),
				minKey = inverted[min];

			this.elem = target;
			this.BBox = target.getBBox();

			if (Modernizr.touchevents) {
				minKey = 'top';
			}

			return minKey;
		};

		return {
			init:       init,
			initNode:   initNode,
			position:   position,
			direction:  direction,
			nodeOnload: nodeOnload
		};
	};

	return Tooltip;
});
