import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { createClickarea } from '../../../../../actions/clickarea';
import classnames from 'classnames';
import styles from './styles/styles.css';
import Button from '../../Button';

export default class CreateClickarea extends Component {

	constructor (props) {
		super(props);

		this.state = {
			val: null
		};
	}

	componentWillReceiveProps (nextProps) {
		$('.textfield, .button')
			.removeAttr('disabled');

		$('#createForm').css('opacity', 1);
	}

	handleSubmit () {
		event.preventDefault();
		this.props.dispatch(createClickarea(this.state.val));
		this.setState({ val: '' });
	}

	render () {
		const textfieldClass = classnames({
			'textfield': true,
			[styles.textfield]: true
		});

		return (
			<div>
				<form id="createForm" className={styles.createForm}>
					<input
						onChange={(e) => this.setState({ val: e.target.value })}
						type="text"
						name="title"
						disabled
						placeholder="Enter clickarea title"
						className={textfieldClass}
						value={this.state.val}
					/>
					<Button
						btnType="dark"
						label="Create clickarea"
						onClick={this.handleSubmit.bind(this)}
					/>
				</form>
			</div>
		);
	}
}

CreateClickarea.propTypes = {
	dispatch: PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		state: state
	};
};

export default connect(mapStateToProps)(CreateClickarea);
