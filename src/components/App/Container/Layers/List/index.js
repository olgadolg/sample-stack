import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './styles/styles.css';
import ListItem from '../ListItem';
import { updateView } from '../../../../../actions/views';
import { selectTool } from '../../../../../actions/controls';

export default class SceneList extends Component {

	constructor (props) {
		super(props);

		this.state = {};
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.viewupdate === false) {
			$('#sceneSelect li:first-child').css('border-radius', '5px 5px 0 0');
			$('li').css({'background-color': '#013B2D'});
			$('li:last-child').css({'background-color': 'rgba(255, 255, 255, 0.2)'});
		}
	}

	onSelectChange (event) {
		$('li').css({'background-color': '#013B2D'});
		$(event.currentTarget).css({'background-color': 'rgba(255, 255, 255, 0.2)'});

		($(event.currentTarget).html().indexOf('Layer') > -1)
			? $('.dropzone').show() : $('.dropzone').hide();

		this.props.dispatch(selectTool('pen'));
		this.props.dispatch(updateView(event.currentTarget.id));
	}

	render () {
		const self = this;
		const layerWrapper = {
			height: '270px',
			marginBottom: '20px',
			marginTop: '20px'
		};
		const list = {
			height: '91%',
			borderRadius: '5px'
		};
		const headingStyle = {
			color: '#013B2D',
			textTransform: 'uppercase',
			fontSize: '12px',
			marginBottom: '5px',
			display: 'block',
			marginLeft: '5px'
		};

		this.scenes = _.map(this.props.scenes, function (scene, i) {
			return (
				<ListItem
					key={scene.viewId}
					className={styles.layerItem}
					onClick={(e) => self.onSelectChange(e)}
					item={scene}
				/>
			);
		});

		return (
			<ul
				style={list}
				id="sceneSelect"
				className={styles.select}
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
		viewUpdate: state.clickareas.viewUpdate
	};
};

export default connect(mapStateToProps)(SceneList);
