import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class ListItem extends Component {

	constructor (props) {
		super(props);

		this.state = {};

		this.handleVisibility = this.handleVisibility.bind(this);
	}

	componentDidMount () {
		$('.hideIcon').show();
	}

	handleVisibility (e) {
		const index = $(e.target).attr('data-index');
		const figure = document.getElementsByClassName('overlay' + (parseInt(index) + 1));

		if (figure[0].style.display === '') {
			figure[0].style.display = 'none';
			$(e.target).css('opacity', 0.5);
		} else {
			figure[0].style.display = '';
			$(e.target).css('opacity', 1);
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
				id={this.props.item.image}>
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
