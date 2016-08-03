import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Toolbox from '../Toolbox';
import { SliderPicker } from 'react-color';
import { selectColor } from '../../../../actions/controls';
import { removeColor } from '../../../../actions/clickarea';
import styles from './styles/styles.css';

export default class Header extends Component {

	constructor () {
		super();

		this.state = {
			color: '#6ec2b3'
		};

		this.handleRemoveColor = this.handleRemoveColor.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
	}

	componentWillReceiveProps (newProps) {
		this.setState({
			color: newProps.color
		});
	}

	handleRemoveColor (event) {
		this.props.dispatch(removeColor());
	}

	handleColorChange (event) {
		this.setState({
			color: event.hex
		});
		this.props.dispatch(selectColor(event));
	}

	render () {
		const logo = require('../../../../images/logo.png');
		const sliderStyle = {
			width: '450px',
			height: 'auto',
			position: 'absolute',
			right: '155px',
			top: '16px'
		};

		const removeIcon = classnames({
			'removeIcon': true,
			[styles.removeIcon]: true
		});

		return (
			<header draggable className={styles.header}>
				<div onClick={(e) => this.handleRemoveColor(e, 'remove')} className={removeIcon}></div>
				<div style={sliderStyle}>
					<SliderPicker
						color={this.state.color}
						onChange={this.handleColorChange}/>
				</div>
				<Toolbox />
				<img src={logo} alt="logo" />
			</header>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		color: state.controls.color
	};
};
export default connect(mapStateToProps)(Header);
