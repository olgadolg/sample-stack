import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles/styles.css';

export default class SceneListItem extends Component {

	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		const itemStyle = {
			listStyle: 'none',
			padding: '10px 20px',
			color: '#fff',
			fontSize: '12px',
			textTransform: 'uppercase',
			borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
			textAlign: 'center',
			cursor: 'pointer'
		};

		return (
			<li
				onClick={this.props.onClick}
				style={itemStyle}
				id={this.props.item.image}>
				{this.props.item.viewId}
			</li>
		);
	}
}

export default connect()(SceneListItem);
