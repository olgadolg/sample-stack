import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
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
		this.removeBackgroundColor = this.removeBackgroundColor.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		let listItems = document.querySelectorAll('.layerList li');

		if (nextProps.addLayer === true) {
			this.removeBackgroundColor(listItems);
		}

		if (nextProps.removeView === true || nextProps.resetRemoveView === true) {
			this.removeBackgroundColor(listItems);
			listItems[listItems.length - 1].classList.add('layerfill');
		}
	}

	removeBackgroundColor (nodes) {
		if (nodes.length) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].classList.remove('layerfill');
				nodes[i].classList.add('no-layerfill');
			}
		}
	}

	onSelectChange (event) {
		if (event.target.classList.value.indexOf('removeIcon') > -1) {
			return;
		}

		let listItems = document.querySelectorAll('.layerList li');
		let dropZone = document.getElementsByClassName('dropzone')[0];

		this.removeBackgroundColor(listItems);
		event.target.classList.add('layerfill');

		(event.currentTarget.innerHTML.indexOf('Layer') > -1)
		? dropZone.style.display = '' : dropZone.style.display = 'none';

		this.props.dispatch(selectTool('pen'));
		this.props.dispatch(updateView(event.currentTarget.id));
	}

	removeView (index, view) {
		this.props.dispatch(removeView(index, view));
		let listItems = document.querySelectorAll('.layerList li');
		listItems[listItems.length - 1].classList.add('layerfill');
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
