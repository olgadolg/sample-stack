import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class ListItem extends Component {

	constructor (props) {
		super(props);

		this.state = {};
		this.handleVisibility = this.handleVisibility.bind(this);
	}

	componentDidMount () {
		const hideIcons = document.getElementsByClassName('hideIcon');

		if (hideIcons.length) {
			for (var i = 0; i < hideIcons.length; i++) {
				hideIcons[i].style.opacity = 1;
			}
		}
	}

	handleVisibility (e) {
		const index = e.target.getAttribute('data-index');
		const figure = document.getElementsByClassName('overlay' + (parseInt(index) + 1));
		const bbRect = document.getElementsByClassName('bbRect');
		const targetStyle = e.target.style;
		const parentClasses = e.target.parentNode.classList;

		if (figure[0].style.display === '') {
			figure[0].style.display = 'none';
			if (parentClasses.value.indexOf('layerfill') > -1) {
				bbRect[0].style.display = 'none';
			}
			targetStyle.opacity = 0.5;
		} else {
			figure[0].style.display = '';
			if (parentClasses.value.indexOf('layerfill') > -1) {
				bbRect[0].style.display = '';
			}
			targetStyle.opacity = 1;
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
					onClick={(e) => this.handleVisibility(e)}
				>
				</div>
			</li>
		);
	}
}

export default connect()(ListItem);
