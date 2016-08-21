import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { showDialog } from '../../../../../actions/dialog';
import { removeView } from '../../../../../actions/views';
import config from 'json!../../../../../../assets/json/dialogs.json';
import styles from './styles/styles.css';

export default class ListItem extends Component {

	constructor (props) {
		super(props);

		this.state = { backgroundClass: '' };
		this.onRemoveLayer = this.onRemoveLayer.bind(this);
	}

	componentDidMount () {
		(this.props.currentView.replace(/(.*)\.(.*?)$/, '$1') === this.props.item.viewId)
			? this.setState({ backgroundClass: 'filled' })
			: this.setState({ backgroundClass: '' });
	}

	onRemoveLayer (e) {
		const index = e.target.id;
		const view = e.target.getAttribute('data-id');
		const data = config.dialogs.removeLayer;

		data.callback = {
			func: removeView,
			params: [index, view]
		};

		this.props.dispatch(showDialog(data));
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
					onClick={(e) => this.onRemoveLayer(e)}
				>
				</div>
			</li>
		);
	}
}

export default connect()(ListItem);
