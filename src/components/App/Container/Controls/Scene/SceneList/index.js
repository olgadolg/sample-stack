import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './styles/styles.css';
import SceneListItem from '../SceneListItem';
import { updateView } from '../../../../../../actions/views';
import { selectTool } from '../../../../../../actions/controls';

export default class SceneList extends Component {

	constructor (props) {
		super(props);

		this.state = {};
	}

	componentWillReceiveProps (nextProps) {
		$('#sceneSelect li:first-child').css('border-radius', '5px 5px 0 0');
	}

	componentDidUpdate (prevProps) {
		if (Object.keys(this.props.scenes).length > Object.keys(prevProps.scenes).length ||
			prevProps.currentView.indexOf('untitled') > -1) {
			$('li').css({'background-color': '#013B2D'});
			$('li:last-child')
				.css({'background-color': 'rgba(255, 255, 255, 0.2)'});
		}
	}

	onSelectChange (event) {
		$('li').css({'background-color': '#013B2D'});
		$(event.currentTarget).css({'background-color': 'rgba(255, 255, 255, 0.2)'});

		($(event.currentTarget).html().indexOf('untitled') > -1)
			? $('.dropzone').show() : $('.dropzone').hide();

		this.props.dispatch(selectTool('pen'));
		this.props.dispatch(updateView(event.currentTarget.id));
	}

	render () {
		const self = this;
		const layerWrapper = {
			height: '350px'
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
				<SceneListItem
					key={scene.viewId}
					className={styles.layerItem}
					onClick={(e) => self.onSelectChange(e)}
					item={scene}
				/>
			);
		});

		return (
			<div style={layerWrapper}>
				<span style={headingStyle}>Layers</span>
				<Scrollbars>
					<ul
						style={list}
						id="sceneSelect"
						className={styles.select}
					>
						{this.scenes}
					</ul>
				</Scrollbars>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		scenes: state.clickareas.views,
		currentView: state.clickareas.currentView
	};
};

export default connect(mapStateToProps)(SceneList);
