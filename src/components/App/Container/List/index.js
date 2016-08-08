import React, { Component } from 'react';
import Layers from '../Layers/List';
import Figures from '../Figures/List';
import $ from 'jquery';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './styles/styles.css';

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

		const headingLayerClass = classnames({
			'heading': true,
			'layerHeading': true,
			[styles.heading]: true
		});

		const headingFigureClass = classnames({
			'heading': true,
			'figureHeading': true,
			[styles.heading]: true
		});

		const headingWrapperClass = classnames({
			'headingWrapper': true,
			[styles.headingWrapper]: true
		});

		return (
			<div>
				<div className={headingWrapperClass}>
					<span
						onClick={(e) => this.handleClick(e)}
						className={headingLayerClass}
					>
					Layers
					</span>
					<span
						onClick={(e) => this.handleClick(e)}
						className={headingFigureClass}
					>
					Figures
					</span>
				</div>
				<div className={wrapperClass}>
					<Scrollbars>
						<Layers />
						<Figures />
					</Scrollbars>
				</div>
			</div>
		);
	}
}
