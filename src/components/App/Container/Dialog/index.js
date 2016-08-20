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
			[styles.modalContent]: true,
			[styles[this.props.transition]]: true
		});

		const textField = classnames({
			'textfield': true,
			[styles.textfield]: true
		});

		if (typeof this.props.content.text !== 'undefined') {
			var header = (typeof this.props.content.text !== 'undefined')
				? this.props.content.text.header : '';

			var body = (typeof this.props.content.text !== 'undefined')
				? this.props.content.text.body : '';
		}

		const buttons = this.props.content.buttons.map((button) => {
			return (
				<button
					onClick={this.props[button.action]}
					className={modalBtn}>
					{button.value}
				</button>
			);
		});

		const textfields = this.props.content.textfields.map((textfield) => {
			return (
				<input
					type="text"
					onClick={this.props[textfield.action]}
					className={textField}
					defaualtValue={textfield.value}
				/>
			);
		});

		return (
			<div className={modalContent}>
				<div>
					<h2>{header}</h2>
					<div className="body">
						<p>{body}</p>
					</div>
					{textfields}
					{buttons}
				</div>
			</div>
		);
	}
}

export default connect()(Dialog);
