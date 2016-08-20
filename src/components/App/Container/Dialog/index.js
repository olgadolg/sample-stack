import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createRect } from '../../../../actions/clickarea';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class Dialog extends Component {

	constructor () {
		super();

		this.state = {
			height: null,
			width: null
		};

		this.setTextfieldValue = this.setTextfieldValue.bind(this);
		this.getState = this.getState.bind(this);
	}

	getState () {
		return this.state;
	}

	setTextfieldValue (e) {
		this.setState({
			[e.target.id]: parseInt(e.target.value)
		}, () => {
			this.props.dispatch(createRect(this.state));
		});
	}

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

		const textFieldWrapper = classnames({
			'textFieldwrapper': true,
			[styles.textFieldWrapper]: true
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
					value={this.state[textfield.value]}
					id={textfield.value}
					type="text"
					onChange={this.setTextfieldValue}
					onClick={this.props[textfield.action]}
					className={textField}
					placeholder={textfield.value}
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
					<div className={textFieldWrapper}>
						{textfields}
					</div>
					{buttons}
				</div>
			</div>
		);
	}
}

export default connect()(Dialog);
