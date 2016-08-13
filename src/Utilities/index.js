import { Component } from 'react';

export default class Utilities extends Component {

	translatePos (style) {
		var transZRegex = /\.*translate\((.*)\)/i;
		var y = transZRegex.exec(style)[1];

		return y;
	}

	createPosition (ui, props, el) {
		const elStyle = el.getAttribute('style');
		const pos = this.translatePos(elStyle);
		const posArr = pos.split(',');

		posArr[0] = parseInt(posArr[0].replace('px', ''));
		posArr[1] = parseInt(posArr[1].replace('px', ''));

		const dist = this.calculateDistance(posArr, props, ui.node.id);
		const position = {name: ui.node.id, x: dist.x, y: dist.y};

		return position;
	}

	calculateDistance (posArr, props, el) {
		var x, y;

		if (posArr[0] + props.workspace[el].x < props.workspace[el].x) {
			x = props.workspace[el].x - Math.abs(posArr[0]);
		} else if (posArr[0] + props.workspace[el].x > props.workspace[el].x) {
			x = props.workspace[el].x + Math.abs(posArr[0]);
		}

		if (posArr[1] + props.workspace[el].y < props.workspace[el].y) {
			y = props.workspace[el].y - Math.abs(posArr[1]);
		} else if (posArr[1] + props.workspace[el].y > props.workspace[el].y) {
			y = props.workspace[el].y + Math.abs(posArr[1]);
		}

		if (typeof y === 'undefined') {
			y = props.workspace[el].y;
		}

		if (typeof x === 'undefined') {
			x = props.workspace[el].x;
		}

		return {
			x: x,
			y: y
		};
	}

	mouseEvent (type, sx, sy, cx, cy) {
		var evt;
		var e = {
			bubbles: false,
			cancelable: (type !== 'mousemove'),
			view: window,
			detail: 0,
			screenX: sx,
			screenY: sy,
			clientX: cx,
			clientY: cy,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			button: 0,
			relatedTarget: undefined
		};

		if (typeof document.createEvent === 'function') {
			evt = document.createEvent('MouseEvents');
			evt.initMouseEvent(type,
			e.bubbles, e.cancelable, e.view, e.detail,
			e.screenX, e.screenY, e.clientX, e.clientY,
			e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
			e.button, document.body.parentNode);
		} else if (document.createEventObject) {
			evt = document.createEventObject();

			for (var prop in evt) {
				evt[prop] = e[prop];
			}

			evt.button = { 0: 1, 1: 4, 2: 2 }[evt.button] || evt.button;
		}

		return evt;
	}

	dispatchEvent (el, type, evt) {
		if (el.dispatchEvent) {
			el.dispatchEvent(evt);
		} else if (el.fireEvent) {
			el.fireEvent('on' + type, evt);
		}
		return evt;
	}
}
