import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class SceneListItem extends Component {

	constructor(props) {
		super(props);

		this.state = {
			
		};
	}

	render() {
		return (
			<option selected="selected">{ this.props.item.viewId }</option>
		);
	}
}

export default connect()(SceneListItem);
