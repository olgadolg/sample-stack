import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import styles from './styles/styles.css';
import { updateFill } from '../../../actions/clickarea';

export default class FillToggler extends Component {

	constructor(props) {
		super(props);

		this.state = {
			checked: false,
			opacity: 1
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({opacity: this.props.opacity});
	}

	handleChange() {
		this.props.dispatch(updateFill(!this.state.checked));
		this.setState({checked: !this.state.checked});
	}

	render() {
		const labelClass = classnames({
			'fillTogglerLabel': true,
			[styles.fillTogglerLabel]: true
		});

		const checkboxClass = classnames({
			'controlIndicator': true,
			[styles.controlIndicator]: true
		});
	
		return (
			<label className={labelClass}>
				<span>Toggle fill</span>
				<input defaultChecked={this.state.checked} onChange={this.handleChange.bind(this)} type="checkbox" />
				<div className={checkboxClass}></div>
			</label>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(FillToggler);
