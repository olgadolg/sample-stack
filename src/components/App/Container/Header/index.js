import React, { Component } from 'react';
import Toolbox from '../Toolbox';
import styles from './styles/styles.css';

export default class Header extends Component {

	render () {
		const logo = require('../../../../images/logo.png');

		return (
			<header draggable className={styles.header}>
				<Toolbox />
				<img src={logo} alt="logo" />
			</header>
		);
	}
}
