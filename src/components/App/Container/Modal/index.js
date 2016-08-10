import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '../Dialog';
import classnames from 'classnames';
import styles from './styles/styles.css';

export default class Modal extends Component {

	constructor () {
		super();

		this.state = {
			isOpen: false
		};

		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
		this.handleModal = this.handleModal.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.handleModal(nextProps);
	}

	handleModal (nextProps) {
		this.setState({isOpen: nextProps.show});
	}

	onCancel () {
		this.setState({ isOpen: false });
	}

	onConfirm () {
		this.setState({ isOpen: false });
	}

	onSubmit (nextProps) {
		this.setState({ isOpen: false });

		this.props.dispatch(
			this.props.content.callback.func.apply(
				null, this.props.content.callback.params
			)
		);
	}

	render () {
		const revealOverlay = classnames({
			'revealOverlay': true,
			[styles.revealOverlay]: true
		});

		const modalWrapper = classnames({
			'modalWrapper': true,
			[styles.modalWrapper]: true
		});

		console.log('isOpen', this.state.isOpen);

		if (this.state.isOpen === false) {
			return null;
		}

		return (
			<div className={revealOverlay}>
				<div className={modalWrapper}>
					<Dialog
						content={this.props.content}
						onCancel={this.onCancel}
						onSubmit={this.onSubmit}
						onConfirm={this.onConfirm}
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		content: state.clickareas.content,
		show: state.clickareas.show
	};
};

export default connect(mapStateToProps)(Modal);
