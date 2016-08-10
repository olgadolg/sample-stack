import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import classnames from 'classnames';
import styles from './styles/styles.css';
import ListItem from '../ListItem';

export default class List extends Component {

	constructor (props) {
		super(props);

		this.state = {};

		this.handleClick = this.handleClick.bind(this);
		this.mouseEvent = this.mouseEvent.bind(this);
		this.dispatchEvent = this.dispatchEvent.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		console.log(nextProps);
	}

	handleClick (event) {
		const id = parseInt(event.target.id);
		const figure = document.querySelector('.clickarea' + (id + 1));
		const bbox = this.props.scenes[this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[id].bbox;
		const mousedown = this.mouseEvent('mousedown', bbox.x + (bbox.width / 2), (bbox.y + bbox.height / 2), bbox.x + (bbox.width / 2), bbox.y + (bbox.height / 2));
		const mouseup = this.mouseEvent('mouseup', bbox.x + (bbox.width / 2), (bbox.y + bbox.height / 2), bbox.x + (bbox.width / 2), bbox.y + (bbox.height / 2));
		let listItems = document.querySelectorAll('.figureList li');

		if (listItems.length) {
			this.removeBackgroundColor(listItems);
		}

		event.target.classList.add('layerfill');
		this.dispatchEvent(figure, 'mousedown', mousedown);
		this.dispatchEvent(figure, 'mouseup', mouseup);
	}

	removeBackgroundColor (nodes) {
		if (nodes.length) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].classList.remove('layerfill');
				nodes[i].classList.add('no-layerfill');
			}
		}
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

	render () {
		if (Object.keys(this.props.scenes).length === 0 || this.props.currentView === '') {
			return null;
		}

		const figureWrapper = classnames({
			'figureWrapper': true,
			[styles.figureWrapper]: true
		});

		const figureHeading = classnames({
			'figureHeading': true,
			[styles.figureHeading]: true
		});

		this.figures = _.map(this.props.scenes[this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas, (figure, i) => {
			return (
				<ListItem
					onClick={this.handleClick}
					item={figure}
					index={i}
				/>
			);
		});

		return (
			<div className={figureWrapper}>
				<h6 className={figureHeading}>
					{this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')}
				</h6>
				<ul
					id="sceneSelect"
					className="figureList"
				>
					{this.figures}
				</ul>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		scenes: state.clickareas.views,
		currentView: state.clickareas.currentView,
		addLayer: state.clickareas.addLayer,
		initLayer: state.clickareas.initLayer,
		viewUpdate: state.clickareas.viewUpdate,
		cut: state.clickareas.cut
	};
};

export default connect(mapStateToProps)(List);
