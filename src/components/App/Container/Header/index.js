import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import Toolbox from '../Tools';
import { SliderPicker } from 'react-color';
import { selectColor } from '../../../../actions/controls';
import { removeColor } from '../../../../actions/clickarea';
import Draggable, {DraggableCore} from 'react-draggable';
import styles from './styles/styles.css';

export default class Header extends Component {

	constructor () {
		super();

		this.state = {
			color: '#6ec2b3'
		};

		this.handleRemoveColor = this.handleRemoveColor.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.onStart = this.onStart.bind(this);
		this.onStop = this.onStop.bind(this);
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

	onStart () {
		let header = document.getElementById('header');
		header.style.zIndex = '99999999';
	}

	onStop () {
		let header = document.getElementById('header');
		header.style.zIndex = '9';
	}

	render () {
		const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
		const logo = require('../../../../images/logo.png');
		const sliderStyle = {
			width: '450px',
			height: 'auto',
			float: 'left',
			right: '110px',
			top: '16px',
			cursor: 'pointer',
			marginLeft: '33px',
			marginTop: '15px'
		};

		const removeIcon = classnames({
			'removeIcon': true,
			[styles.removeIcon]: true
		});

		return (
			<Draggable zIndex={9999999} {...dragHandlers}>
				<header id="header" className={styles.header}>
					<img src={logo} alt="logo" />
					<Toolbox />
					<div style={sliderStyle}>
						<SliderPicker
							color={this.state.color}
							onChange={this.handleColorChange}/>
					</div>
					<div onClick={(e) => this.handleRemoveColor(e, 'remove')} className={removeIcon}></div>
				</header>
			</Draggable>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		color: state.clickareas.color
	};
};
export default connect(mapStateToProps)(Header);
