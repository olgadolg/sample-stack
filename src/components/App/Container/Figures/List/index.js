import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './styles/styles.css';
import ListItem from '../ListItem';
import { updateView } from '../../../../../actions/views';
import { selectTool } from '../../../../../actions/controls';

export default class FigureList extends Component {

	constructor (props) {
		super(props);

		this.state = {};
	}

	componentWillReceiveProps (nextProps) {

	}

	onSelectChange (event) {

	}

	render () {

		if (Object.keys(this.props.scenes).length === 0 || this.props.currentView === '') {
			return null;
		}

		console.log('layers', this.props.scenes, 'current', this.props.currentView)

		this.figures = _.map(this.props.scenes[this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas, function (figure, i) {

			console.log('figure', figure);

			return (
				<ListItem
					onClick={(e) => self.onSelectChange(e)}
					item={figure}
				/>
			);
		});


		return (
			<ul
				id="sceneSelect"
			>
				{this.figures}
			</ul>
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

export default connect(mapStateToProps)(FigureList);
