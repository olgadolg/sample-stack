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

		if (type === 'pen' || type === 'penAdd' || type === 'penRemove') {
			$('svg').css('cursor', 'crosshair');
		} else {
			$('svg').css('cursor', 'default');
		}

		for (var item in this.state) {
			if (type === item) {
				obj[type] = true;
				$('.' + [type] + 'Icon').css({
					'box-shadow': 'inset 1px 1px 1px 0px rgba(50, 50, 50, 0.75), inset -1px -1px 0px 0px rgba(224, 229, 231, 0.75',
					'border': 'none',
					'background-color': 'rgba(110, 194, 179, 0.7)',
					'margin-top': '1px',
					'height': '42px',
					'width': '42px'
				});

			} else {
				obj[item] = false;
				$('.' + [item] + 'Icon').css({
					'box-shadow': 'none',
					'background-color': 'transparent',
					'border': '1px solid #fff',
					'height': '40px',
					'width': '40px'
				});
			}
		}

		this.setState(obj, () => {
			var isSelected;

			for (var tool in this.state) {
				if (this.state[tool] === true) {
					isSelected = tool;
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

		return (
			<div className={toolBox}>
				<div onClick={(e) => this.handleClick(e, 'pen')} className={penIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'penAdd')} className={penAddIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'penRemove')} className={penRemoveIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'select')} className={selectIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'selectAll')} className={selectAllIcon}></div>
			</div>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(Toolbox);
