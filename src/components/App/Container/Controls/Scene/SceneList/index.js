import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import styles from './styles/styles.css';
import SceneListItem from '../SceneListItem';
import { updateView } from '../../../../../../actions/views';

export default class SceneList extends Component {

	constructor (props) {
		super(props);

		this.state = {

		};
	}

	componentWillReceiveProps (nextProps) {
		$('#sceneSelect')
			.removeAttr('disabled')
			.css('opacity', 1);
	}

	onSelectChange (event) {
		this.props.dispatch(updateView(event.currentTarget.value));
	}

	render () {
		this.scenes = _.map(this.props.scenes, function (scene, i) {
			return (
				<SceneListItem key={scene.viewId} item={scene} />
			);
		});

		return (
			<select
				disabled="disabled"
				id="sceneSelect" className={styles.select}
				onChange={(e) => this.onSelectChange(e)}
			>
				{this.scenes}
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
