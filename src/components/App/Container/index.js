import React, { Component } from 'react';
import Header from './Header';
import Controls from './Controls';
import Canvas from './Canvas';
import styles from './styles/styles.css';

export default class Container extends Component {

	render () {
		return (
			<div className="wrapper">
				<Header />
				<Controls />
				<Canvas />
			</div>
		);
	}
}
