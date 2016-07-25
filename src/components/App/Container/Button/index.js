import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class Button extends Component {
	render() {
		const btnClass = classnames({
			'btn btn-primary': true,
			'btn-danger': this.props.showError,
			[styles.button]: true,
		});

		return (
			<button className={btnClass} type='button' onClick={this.props.onClick}>
				{this.props.label}
			</button>
		);
	}
}
