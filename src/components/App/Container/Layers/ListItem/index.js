import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class ListItem extends Component {

	constructor (props) {
		super(props);

		this.state = {
			backgroundClass: ''
		};

		this.handleRemove = this.handleRemove.bind(this);
	}

	componentDidMount () {
		if (this.props.members.indexOf(this.props.member) === this.props.members.length - 1) {
			this.setState({ backgroundClass: 'filled' });
		} else {
			this.setState({ backgroundClass: '' });
		}
	}

	handleRemove (e) {
		const index = $(e.target).attr('id');
		const view = $(e.target).attr('data-id');

		if (confirm('Are you sure you want to remove this layer?')) {
			this.props.removeView(index, view);
		}
	}

	render () {
		const itemStyle = classnames({
			'layerItem': true,
			[styles.layerItem]: true
		});

		const removeIcon = classnames({
			'removeIcon': true,
			[styles.removeIcon]: true
		});

		return (
			<li
				onClick={this.props.onClick}
				className={itemStyle}
				data-custom-attribute={this.state.backgroundClass}
				id={this.props.item.image}>
				{this.props.item.viewId}
				<div
					id={this.props.item.viewId}
					data-id={this.props.item.viewId}
					className={removeIcon}
					onClick={(e) => this.handleRemove(e)}
				>
				</div>
			</li>
		);
	}
}

export default connect()(ListItem);
