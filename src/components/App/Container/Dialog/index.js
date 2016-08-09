import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class Dialog extends Component {

	render () {
		const modalBtn = classnames({
			'modalBtn': true,
			[styles.modalBtn]: true
		});

		const modalContent = classnames({
			'modalContent': true,
			[styles.modalContent]: true
		});

		if (typeof this.props.content.text !== 'undefined') {
			var header = (typeof this.props.content.text !== 'undefined')
				? this.props.content.text.header : '';

			var body = (typeof this.props.content.text !== 'undefined')
				? this.props.content.text.body : '';
		}

		return (
			<div className={modalContent}>
				<h2>{header}</h2>
				<div className="body">
					<p>{body}</p>
				</div>
				<button
					onClick={this.props.onSubmit}
					className={modalBtn}>
					Cancel
				</button>
				<button
					onClick={this.props.onSubmit}
					className={modalBtn}>
					Yes
				</button>
			</div>
		);
	}
}

export default connect()(Dialog);
