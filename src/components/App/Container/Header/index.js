import React, { Component } from 'react';
import styles from './styles/styles.css';

export default class Header extends Component {

	render () {
		const logo = require('../../../../images/logo.png');

		return (
			<header className={styles.header}>
				<img src={logo} />
			</header>
		);
	}
}
