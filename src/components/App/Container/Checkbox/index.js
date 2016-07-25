import React, { Component } from 'react';
import classnames from 'classnames';
import $ from 'jquery';
import { connect } from 'react-redux';
import styles from './styles/styles.css';
import { updateFill } from '../../../../actions/clickarea';

export default class FillToggler extends Component {

	render () {
		const checkboxClass = classnames({
			'controlIndicator': true,
			[styles.controlIndicator]: true
		});

		return (
			<label className={this.props.labelClass}>
				<span>{this.props.label}</span>
				<input defaultChecked={this.props.checked} onChange={this.props.onChange} type="checkbox" />
				<div className={checkboxClass}></div>
			</label>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(FillToggler);
