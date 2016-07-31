import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import styles from './styles/styles.css';
import { selectTool } from '../../../../actions/controls';

export default class Toolbox extends Component {

	constructor () {
		super();

		this.state = {
			pen: true,
			penAdd: false,
			penRemove: false,
			select: false,
			selectAll: true
		};

		this.handelClick = this.handleClick.bind(this);
	}

	handleClick (event, type) {
		var obj = {};

		$('.handle').removeClass('selected');

		for (var item in this.state) {
			if (type === item) {
				obj[type] = true;
			} else {
				obj[item] = false;
			}
		}

		this.setState(obj, () => {
			var isSelected;

			for (var tool in this.state) {
				if (this.state[tool] === true) {
					isSelected = tool;
					$('.' + tool + 'Icon').css({'box-shadow': 'inset 0px 0px 0px 4px rgba(110, 194, 179, 1)'});
				} else {
					$('.' + tool + 'Icon').css({'box-shadow': 'none'});
				}
			}

			this.props.dispatch(selectTool(isSelected));
		});
	}

	render () {
		const toolBox = classnames({
			'toolBox': true,
			[styles.toolBox]: true
		});

		const penIcon = classnames({
			'tool': true,
			'penIcon': true,
			[styles.tool]: true,
			[styles.penIcon]: true
		});

		const penAddIcon = classnames({
			'tool': true,
			'penAddIcon': true,
			[styles.tool]: true,
			[styles.penAddIcon]: true
		});

		const penRemoveIcon = classnames({
			'tool': true,
			'penRemoveIcon': true,
			[styles.tool]: true,
			[styles.penRemoveIcon]: true
		});

		const selectIcon = classnames({
			'tool': true,
			'selectIcon': true,
			[styles.tool]: true,
			[styles.selectIcon]: true
		});

		const selectAllIcon = classnames({
			'tool': true,
			'selectAllIcon': true,
			[styles.tool]: true,
			[styles.selectAllIcon]: true
		});

		const layerIcon = classnames({
			'tool': true,
			'layerIcon': true,
			[styles.tool]: true,
			[styles.layerIcon]: true
		});

		return (
			<div className={toolBox}>
				<div onClick={(e) => this.handleClick(e, 'pen')} className={penIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'penAdd')} className={penAddIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'penRemove')} className={penRemoveIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'select')} className={selectIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'selectAll')} className={selectAllIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'layer')} className={layerIcon}></div>
			</div>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(Toolbox);
