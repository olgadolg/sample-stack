import React, { Component } from 'react';
import { connect } from 'react-redux';

export default class SceneListItem extends Component {

	constructor (props) {
		super(props);

		this.state = {};
	}

	render () {
		return (
			<option
				key={this.props.item}
				value={this.props.item.image}
			>
				{this.props.item.viewId}
			</option>
		);
	}
}

export default connect()(SceneListItem);
