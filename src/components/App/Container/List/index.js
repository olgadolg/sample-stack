import React, { Component } from 'react';
import Layers from '../Layers/List';
import Figures from '../Figures/List';
import $ from 'jquery';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from '../styles/styles.css';

export default class List extends Component {

	constructor () {
		super();

		this.state = {
			layers: 'display: block',
			figures: 'display: none'
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick (e) {
		if ($(e.target).hasClass('figureHeading')) {
			$('.layerList').hide();
			$('.figureList').show();
		} else {
			$('.layerList').show();
			$('.figureList').hide();
		}
	}

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
			marginLeft: '5px',
			float: 'left',
			marginRight: '10px',
			cursor: 'pointer'
		};

		const headingWrapperStyle = {
			overflow: 'hidden',
			marginBottom: '5px'
		};

		return (
			<div>
				<div style={headingWrapperStyle}>
					<span onClick={(e) => this.handleClick(e)} className="layerHeading" style={headingStyle}>Layers</span>
					<span onClick={(e) => this.handleClick(e)} className="figureHeading" style={headingStyle}>Figures</span>
				</div>
				<div style={list} className={wrapperClass}>
					<Scrollbars>
						<Layers />
						<Figures />
					</Scrollbars>
				</div>
			</div>
		);
	}
}
