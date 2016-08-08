import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import classnames from 'classnames';
import styles from './styles/styles.css';
import ListItem from '../ListItem';

export default class List extends Component {

	constructor (props) {
		super(props);

		this.state = {};
	}

	onSelectChange (event) {}

	render () {
		if (Object.keys(this.props.scenes).length === 0 || this.props.currentView === '') {
			return null;
		}

		const figureWrapper = classnames({
			'figureWrapper': true,
			[styles.figureWrapper]: true
		});

		const figureHeading = classnames({
			'figureHeading': true,
			[styles.figureHeading]: true
		});

		this.figures = _.map(this.props.scenes[this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas, function (figure, i) {
			return (
				<ListItem
					onClick={(e) => this.onSelectChange(e)}
					item={figure}
				/>
			);
		});

		return (
			<div className={figureWrapper}>
				<h6 className={figureHeading}>
					{this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')}
				</h6>
				<ul
					id="sceneSelect"
					className="figureList"
				>
					{this.figures}
				</ul>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		scenes: state.clickareas.views,
		currentView: state.clickareas.currentView,
		addLayer: state.clickareas.addLayer,
		initLayer: state.clickareas.initLayer,
		viewUpdate: state.clickareas.viewUpdate
	};
};

export default connect(mapStateToProps)(List);
