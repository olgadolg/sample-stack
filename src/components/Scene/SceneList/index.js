import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import styles from './styles/styles.css';
import SceneListItem from '../SceneListItem';
import { updateView } from '../../../actions/views';

export default class SceneList extends Component {

	constructor (props) {
		super(props);

		this.state = {

		};
	}

	onSelectChange (event) {
		this.props.dispatch(updateView(event.currentTarget.value));
	}

	render () {
		var scenes = _.map(this.props.scenes, function (scene, i) {
			return (
				<SceneListItem key={scene.viewId} item={scene} />
			);
		});

		if (scenes.length) {
			$('#sceneSelect').show();
		}

		return (
			<select
				id="sceneSelect" className={styles.select}
				onChange={(e) => this.onSelectChange(e)}
			>
				{scenes}
			</select>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		scenes: state.clickareas.views
	};
};

export default connect(mapStateToProps)(SceneList);
