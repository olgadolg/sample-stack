import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class ListItem extends Component {

	constructor (props) {
		super(props);

		this.state = {};
		this.onVisibilityClick = this.onVisibilityClick.bind(this);
	}

	componentDidMount () {
		const hideIcons = document.getElementsByClassName('hideIcon');

		if (hideIcons.length) {
			for (var i = 0; i < hideIcons.length; i++) {
				hideIcons[i].style.opacity = 1;
			}
		}
	}

	handleClick (event) {
		if (event.target.classList.value.indexOf('hideIcon') > -1) {
			return;
		}

		const id = parseInt(event.target.id) || 0;
		const figure = document.querySelector('.clickarea' + (id + 1));
		const bbox = this.props.layers[this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[id].bbox;
		const mousedown = this.utilites.mouseEvent('mousedown', bbox.x + (bbox.width / 2), (bbox.y + bbox.height / 2), bbox.x + (bbox.width / 2), bbox.y + (bbox.height / 2));
		const mouseup = this.utilites.mouseEvent('mouseup', bbox.x + (bbox.width / 2), (bbox.y + bbox.height / 2), bbox.x + (bbox.width / 2), bbox.y + (bbox.height / 2));

		let listItems = document.querySelectorAll('.figureList li');

		if (listItems.length) {
			event.target.classList.add('layerfill');
		}

		this.utilites.dispatchEvent(figure, 'mousedown', mousedown);
		this.utilites.dispatchEvent(figure, 'mouseup', mouseup);
	}

	onVisibilityClick (e) {
		let bbRect = document.getElementsByClassName('bbRect');
		const index = e.target.getAttribute('data-index');
		const figure = document.getElementsByClassName('overlay' + (parseInt(index) + 1));
		const targetStyle = e.target.style;
		const parentClasses = e.target.parentNode.classList;

		$(e.target).css('pointer-events', 'all');

		if (figure[0].style.display === '') {
			figure[0].style.display = 'none';

			if (parentClasses.value.indexOf('layerfill') > -1) {
				if (typeof bbRect !== 'undefined') {
					bbRect[0].style.display = 'none';
				}
			}

			targetStyle.opacity = 0.5;
			$(e.target.parentNode).css('pointer-events', 'none');
			$(e.target.parentNode).removeClass('layerfill');
		} else {
			figure[0].style.display = '';

			if (parentClasses.value.indexOf('layerfill') > -1) {
				if (typeof bbRect !== 'undefined') {
					bbRect[0].style.display = '';
				}
			}

			targetStyle.opacity = 1;
			$(e.target.parentNode).css('pointer-events', 'all');
		}
	}

	render () {
		const itemStyle = classnames({
			'figureItem': true,
			[styles.figureItem]: true
		});

		const hideIcon = classnames({
			'hideIcon': true,
			[styles.hideIcon]: true
		});

		return (
			<li
				onClick={this.props.onClick}
				className={itemStyle}
				id={this.props.index}>
				{this.props.item.goTo}
				<div
					data-index={this.props.index}
					className={hideIcon}
					onClick={(e) => this.onVisibilityClick(e)}
				>
				</div>
			</li>
		);
	}
}

export default connect()(ListItem);
