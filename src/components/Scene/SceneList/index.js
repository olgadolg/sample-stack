import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import _ from 'underscore';
import $ from 'jquery';
import styles from './styles/styles.css';
import SceneListItem from '../SceneListItem';

export default class SceneList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			
		};
	}

	render() {
		var scenes = _.map(this.props.scenes, function(scene, i) {
			return (
				<SceneListItem item={ scene } /> 
			)
		});

		if (scenes.length) {
			$('#sceneSelect').show();
		}

		return (
			<select id="sceneSelect" className={ styles.select }>
				{scenes}
			</select>
		);
	}
}

const mapStateToProps = (state) => { 
	return {
		scenes: state.clickareas.views
	}
}

export default connect(mapStateToProps)(SceneList);
