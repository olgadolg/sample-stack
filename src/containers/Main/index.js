import React, { Component } from 'react';
import ControlContainer from '../../containers/Controls';
import Canvas from '../../containers/Canvas';
import styles from './styles/styles.css';

export default class Main extends Component {

	render() {
		return (
			<div className="wrapper">
				<ControlContainer />
				<Canvas />
			</div>
		);
	}
}
