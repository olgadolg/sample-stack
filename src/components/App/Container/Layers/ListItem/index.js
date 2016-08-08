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

		return (
			<li
				onClick={this.props.onClick}
				className={itemStyle}
				id={this.props.item.image}>
				{this.props.item.viewId}
			</li>
		);
	}
}

export default connect()(ListItem);
