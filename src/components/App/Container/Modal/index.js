import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import styles from './styles/styles.css';

export default class Modal extends Component {

	render () {
		console.log(this.props.isOpen)
		if (this.props.isOpen) {
			return (
				<ReactCSSTransitionGroup transitionName={this.props.transitionName}>
					<div className="modal">
						{this.props.children}
					</div>
				</ReactCSSTransitionGroup>
			);
		} else {
			return <ReactCSSTransitionGroup transitionName={this.props.transitionName} />;
		}
	}
}
