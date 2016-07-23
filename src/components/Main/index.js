import React, { Component } from 'react';
import ControlContainer from './Controls';
import Canvas from './Canvas';
import styles from './styles/styles.css';

export default class Main extends Component {

	render () {
		return (
			<div className="wrapper">
				<ControlContainer />
				<Canvas />
			</div>
		);
	}
}
