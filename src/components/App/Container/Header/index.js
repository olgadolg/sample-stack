import React, { Component } from 'react';
import { connect } from 'react-redux';
import Toolbox from '../Toolbox';
import { SliderPicker } from 'react-color';
import { selectColor } from '../../../../actions/controls';
import styles from './styles/styles.css';

export default class Header extends Component {

	constructor () {
		super();

		this.state = {
			background: '#6ec2b3'
		};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange (event) {
		this.setState({
			background: event.hex
		});
		this.props.dispatch(selectColor(event));

	}

	render () {
		const logo = require('../../../../images/logo.png');
		const sliderStyle = {
			width: '450px',
			height: 'auto',
			position: 'absolute',
			right: '215px',
			top: '16px'
		};

		return (
			<header draggable className={styles.header}>
				<div style={sliderStyle}>
					<SliderPicker
						color={this.state.background}
						onChange={this.handleChange}/>
				</div>
				<Toolbox />
				<img src={logo} alt="logo" />
			</header>
		);
	}
}

export default connect()(Header);
