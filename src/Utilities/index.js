import { Component } from 'react';

export default class Utilities extends Component {

	translatePos (style) {
		var transZRegex = /\.*translate\((.*)\)/i;
		var y = transZRegex.exec(style)[1];

		return y;
	}

	calculateDistance (posArr, props) {
		var x, y;

		if (posArr[0] <= props.workspace.header.x) {
			x = props.workspace.header.x - Math.abs(posArr[0]);
		} else if (posArr[0] >= props.workspace.header.x) {
			x = props.workspace.header.x + Math.abs(posArr[0]);
		}

		if (posArr[1] <= props.workspace.header.y) {
			y = props.workspace.header.y - Math.abs(posArr[1]);
		} else if (posArr[1] >= props.workspace.header.y) {
			y = props.workspace.header.y + Math.abs(posArr[1]);
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
