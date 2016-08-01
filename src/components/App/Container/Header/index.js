import React, { Component } from 'react';
import Toolbox from '../Toolbox';
import { SliderPicker } from 'react-color';
import styles from './styles/styles.css';

export default class Header extends Component {

	render () {
		const logo = require('../../../../images/logo.png');
		const sliderStyle = {
			width: '200px',
			height: 'auto',
			position: 'absolute',
			right: '250px',
			top: '7px'
		};

		return (
			<header draggable className={styles.header}>
				<div style={sliderStyle}>
					<SliderPicker />
				</div>
				<Toolbox />
				<img src={logo} alt="logo" />
			</header>
		);
	}
}
