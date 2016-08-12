import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import classnames from 'classnames';
import styles from './styles/styles.css';
import ListItem from '../ListItem';
import { selectTool } from '../../../../../actions/controls';
import Utilities from '../../../../../Utilities';

export default class List extends Component {

	constructor (props) {
		super(props);

		this.state = {};
		this.utilites = new Utilities();
		this.handleClick = this.handleClick.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		let listItems = document.querySelectorAll('.figureList li');

		if (nextProps.isSelected === true) {
			this.removeBackgroundColor(listItems);
			let figureItem = document.getElementById(nextProps.coordIndex);
			//figureItem.classList.add('layerfill');
		}
	}

	handleClick (event) {
		if (event.target.classList.value.indexOf('hideIcon') > -1) {
			return;
		}

		this.props.dispatch(selectTool('selectAll'));

		const id = parseInt(event.target.id) || 0;
		const figure = document.querySelector('.clickarea' + (id + 1));
		const bbox = this.props.scenes[this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[id].bbox;
		const mousedown = this.utilites.mouseEvent('mousedown', bbox.x + (bbox.width / 2), (bbox.y + bbox.height / 2), bbox.x + (bbox.width / 2), bbox.y + (bbox.height / 2));
		const mouseup = this.utilites.mouseEvent('mouseup', bbox.x + (bbox.width / 2), (bbox.y + bbox.height / 2), bbox.x + (bbox.width / 2), bbox.y + (bbox.height / 2));

		let listItems = document.querySelectorAll('.figureList li');

		if (listItems.length) {
			this.removeBackgroundColor(listItems);
			event.target.classList.add('layerfill');
		}

		this.utilites.dispatchEvent(figure, 'mousedown', mousedown);
		this.utilites.dispatchEvent(figure, 'mouseup', mouseup);
	}

	removeBackgroundColor (nodes) {
		if (nodes.length) {
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].classList.remove('layerfill');
			}
		}
	}

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

		this.figures = _.map(this.props.scenes[this.props.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas, (figure, i) => {
			return (
				<ListItem
					onClick={this.handleClick}
					item={figure}
					index={i}
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
		viewUpdate: state.clickareas.viewUpdate,
		cut: state.clickareas.cut,
		isSelected: state.clickareas.isSelected,
		coordIndex: state.clickareas.coordIndex
	};
};

export default connect(mapStateToProps)(List);
