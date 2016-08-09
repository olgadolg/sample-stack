import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '../Dialog';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class Modal extends Component {

	constructor () {
		super();

		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		console.log(nextProps.content);
	}

	onCancel () {}

	onSubmit () {}

	render () {
		const modalWrapper = classnames({
			'modalWrapper': true,
			[styles.modalWrapper]: true
		});

		return (
			<div className={modalWrapper}>
				<Dialog
					header={this.props.content.body}
					body={this.props.content.accept}
					onCancel={this.onCancel}
					onSubmit={this.onSubmit}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		content: state.dialog.content
	};
};

export default connect(mapStateToProps)(Modal);
