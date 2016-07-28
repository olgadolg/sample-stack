import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
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

	handleClick (event, type) {
		var obj = {};

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

		return (
			<div className={toolBox}>
				<div onClick={(e) => this.handleClick(e, 'pen')} className={styles.penIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'select')} className={styles.selectIcon}></div>
				<div onClick={(e) => this.handleClick(e, 'selectAll')} className={styles.selectAllIcon}></div>
			</div>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(Toolbox);
