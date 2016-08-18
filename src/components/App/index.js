import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './styles/styles.css';

export class App extends Component {

	render () {
		const toolsIcon = classnames({
			'toolsIcon': true,
			[styles.toolsIcon]: true
		});

		const settingsIcon = classnames({
			'settingsIcon': true,
			[styles.settingsIcon]: true
		});

		return (
			<div>
				<div className={toolsIcon}></div>
				<div className={settingsIcon}></div>
				{this.props.children}
			</div>
		);
	}
}

App.propTypes = {
	children: PropTypes.object
};

export default connect()(App);
