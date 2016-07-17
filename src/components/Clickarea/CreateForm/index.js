import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createClickarea } from '../../../actions/clickarea';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class CreateClickarea extends Component {

	constructor(props) {
		super(props);

		this.state = {
			val: null
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.dispatch(createClickarea());
	}

	render() {
		const textfieldClass = classnames({
			'textfield': true,
			[styles.textfield]: true
		});

		const btnClass = classnames({
			'button': true,
			[styles.button]: true
		});

		return (
			<form id="createForm" className={styles.controlsContainer} onSubmit={this.handleSubmit.bind(this)}>
				<input
					onChange={e => this.setState({ val: e.target.value })}
					type="text"
					name="title"
					className={textfieldClass}
				/>
				
				<button className={btnClass} type='submit'>Create new clickarea</button>
			</form>
		);
	}
}

CreateClickarea.propTypes = {
  dispatch: PropTypes.func
}

export default connect()(CreateClickarea);
