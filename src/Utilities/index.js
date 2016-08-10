import { Component } from 'react';

export default class Utilities extends Component {

	constructor () {
		super();
	}

	mouseEvent (type, sx, sy, cx, cy) {
		var evt;
		var e = {
			bubbles: true,
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
