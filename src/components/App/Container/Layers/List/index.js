import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import styles from './styles/styles.css';
import ListItem from '../ListItem';
import { updateView } from '../../../../../actions/views';
import { selectTool } from '../../../../../actions/controls';
import { removeView } from '../../../../../actions/views';

export default class SceneList extends Component {

	constructor (props) {
		super(props);

		this.state = {};
		this.onSelectChange = this.onSelectChange.bind(this);
		this.removeView = this.removeView.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.addLayer === true) {
			$('.layerList li').css({'background-color': '#013B2D'});
		}

		if (nextProps.removeView === true || nextProps.resetRemoveView === true) {
			$('.layerList li').css({'background-color': '#013B2D'});
			$('.layerList li:last-child').css({'background-color': 'rgba(255, 255, 255, 0.2)'});
		}
	}

	onSelectChange (event) {
		if ($(event.target).hasClass('removeIcon')) {
			return;
		}

		$('.layerList li').css({'background-color': '#013B2D'});
		$(event.currentTarget).css({'background-color': 'rgba(255, 255, 255, 0.2)'});
		($(event.currentTarget).html().indexOf('Layer') > -1) ? $('.dropzone').show() : $('.dropzone').hide();

		this.props.dispatch(selectTool('pen'));
		this.props.dispatch(updateView(event.currentTarget.id));
	}

	removeView (index, view) {
		this.props.dispatch(removeView(index, view));
		$('.layerList li:last-child').css({'background-color': 'rgba(255, 255, 255, 0.2)'});
	}

	render () {
		this.scenes = _.map(this.props.scenes, (scene, i) => {
			return (
				<ListItem
					key={scene.viewId}
					members={Object.keys(this.props.scenes)}
					member={i}
					viewUpdate={this.props.viewUpdate}
					className={styles.layerItem}
					onClick={(e) => this.onSelectChange(e)}
					removeView={this.removeView}
					item={scene}
				/>
			);
		});

		return (
			<ul
				id="sceneSelect"
				className="layerList"
			>
				{this.scenes}
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
		viewUpdate: state.clickareas.viewUpdate,
		viewRemoved: state.clickareas.viewRemoved,
		resetRemoveView: state.clickareas.resetRemoved
	};
};

export default connect(mapStateToProps)(SceneList);
