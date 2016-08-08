import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class ListItem extends Component {

	constructor (props) {
		super(props);

		this.state = {};
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
				id={this.props.item.image}>
				{this.props.item.viewId}
				<div
					data-id={this.props.viewId}
					className={removeIcon}
					onClick={(e) => this.handleVisibility(e)}
				>
				</div>
			</li>
		);
	}
}

export default connect()(ListItem);
