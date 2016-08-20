import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from '../Dialog';
import { hideDialog } from '../../../../actions/dialog';
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
		this.onReload = this.onReload.bind(this);
		this.handleModal = this.handleModal.bind(this);
		this.onCloseOverlay = this.onCloseOverlay.bind(this);
		this.onCreateRect = this.onCreateRect.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		this.handleModal(nextProps);
	}

	handleModal (nextProps) {
		this.setState({isOpen: nextProps.show});
	}

	onCreateRect () {
		this.setState({ isOpen: false });
		this.props.dispatch(hideDialog());
	}

	onCancel () {
		this.setState({ isOpen: false });
		this.props.dispatch(hideDialog());
	}

	onConfirm () {
		this.setState({ isOpen: false });
		this.props.dispatch(hideDialog());
	}

	onReload () {
		this.setState({ isOpen: false });
		this.props.dispatch(hideDialog());
	}

	onCloseOverlay () {
		this.setState({ isOpen: false });
		this.props.dispatch(hideDialog());
	}

	onSubmit (nextProps) {
		this.setState({ isOpen: false });

		this.props.dispatch(
			this.props.content.callback.func.apply(
				null, this.props.content.callback.params
			)
		);

		this.props.dispatch(hideDialog());
	}

	render () {
		const revealOverlay = classnames({
			'revealOverlay': true,
			[styles.revealOverlay]: true,
			[styles[this.props.content.overlay]]: true
		});

		const modalWrapper = classnames({
			'modalWrapper': true,
			[styles.modalWrapper]: true
		});

		if (this.state.isOpen === false) {
			return null;
		}

		return (
			<div className={revealOverlay}>
				<div className={modalWrapper}>
					<Dialog
						ref="dialog"
						content={this.props.content}
						onCancel={this.onCancel}
						onSubmit={this.onSubmit}
						onConfirm={this.onConfirm}
						onReload={this.onReload}
						transition={this.props.content.animation}
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
