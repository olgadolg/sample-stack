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

		var buttons = this.props.content.buttons.map((button) => {
			return (
				<button
					onClick={this.props[button.action]}
					className={modalBtn}>
					{button.value}
				</button>
			);
		});

		return (
			<div className={modalContent}>
				<div>
					<h2>{header}</h2>
					<div className="body">
						<p>{body}</p>
					</div>
					{buttons}
				</div>
			</div>
		);
	}
}

export default connect()(Dialog);
