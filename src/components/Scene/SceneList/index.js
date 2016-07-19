import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class SceneList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			
		};
	}

	render() {

		return (
			<select className={styles.select}>
				<option selected="selected">Choose view</option>
				<option>I love Steve Jobs</option>
				<option>PHP is awesome</option>
			</select>
		);
	}
}

export default connect()(SceneList);
