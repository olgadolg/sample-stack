import React, { Component } from 'react';
import Layers from '../Layers/List';
import Figures from '../Figures/List';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../styles/styles.css';

export default class Container extends Component {

	render () {
		const wrapperClass = classnames({
			'select': true,
			[styles.select]: true
		});

		const layerWrapper = {
			height: '270px',
			marginBottom: '20px',
			marginTop: '20px'
		};

		const list = {
			height: '250px',
			borderRadius: '5px',
			marginBottom: '20px'
		};

		const headingStyle = {
			color: '#013B2D',
			textTransform: 'uppercase',
			fontSize: '12px',
			marginTop: '20px',
			marginBottom: '5px',
			display: 'block',
			marginLeft: '5px'
		};

		console.log(styles)

		return (
			<div>
				<span style={headingStyle}>Layers</span>
				<div style={list} className={wrapperClass}>
					<Scrollbars>
						<Figures />
					</Scrollbars>
				</div>
			</div>
		);
	}
}
