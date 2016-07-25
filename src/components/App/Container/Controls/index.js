import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import $ from 'jquery';
import Checkbox from '../Checkbox';
import CreateForm from './CreateForm';
import ImageUpload from './ImageUpload';
import SceneList from './Scene/SceneList';
import styles from './styles/styles.css';
import checkboxStyles from '../Checkbox/styles/styles.css';
import { updateFill } from '../../../../actions/clickarea';

export default class ControlsContainer extends Component {

	constructor () {
		super();

		this.state = {
			fillChecked: false
		};
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.clickareas.clickarea.coords !== null) {
			$('.lockFillWrapper').fadeIn();
		}

		this.setState({opacity: this.props.opacity});
	}

	fillChange () {
		this.props.dispatch(updateFill(!this.state.fillChecked));
		this.setState({fillChecked: !this.state.fillChecked});
	}

	render () {
		const lockFillWrapper = classnames({
			'lockFillWrapper': true,
			[styles.lockFillWrapper]: true
		});

		const labelClass = classnames({
			'checkboxLabel': true,
			[checkboxStyles.checkboxLabel]: true
		});

		return (
			<div className={styles.controlsContainer} >
				<div className={lockFillWrapper}>
					<Checkbox
						labelClass={labelClass}
						onChange={this.fillChange.bind(this)}
						checked={this.state.fillChecked}
						label="Toggle Fill"
					/>
					<Checkbox
						labelClass={labelClass}
						label="Lock position"
					/>
				</div>
				<ImageUpload />
				<SceneList />
				<CreateForm />
			</div>
		);
	}
}

const mapStateToProps = (state) => state;
export default connect(mapStateToProps)(ControlsContainer);
