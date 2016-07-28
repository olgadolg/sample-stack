import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import styles from './styles/styles.css';
import { selectTool } from '../../../../../actions/controls';

export default class Toolbox extends Component {

	constructor () {
		super();

		this.state = {
			pen: false,
			select: false,
			selectAll: true
		};

		this.handelClick = this.handleClick.bind(this);
	}

	componentDidMount () {
		$('.' + this.props.controls.tool + 'Icon')
			.css({'background-color': '#6EC2B3'});
	}

	handleClick (event, type) {
		var obj = {};

		for (var item in this.state) {
			if (type === item) {
				obj[type] = true;
				$('.' + [type] + 'Icon').css({'background-color': '#6EC2B3'});
			} else {
				obj[item] = false;
				$('.' + [item] + 'Icon').css({'background-color': '#ffffff'});

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
				<div onClick={(e) => this.handleClick(e, 'select')} className={selectIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'selectAll')} className={selectAllIcon}></div>
			</div>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(Toolbox);
