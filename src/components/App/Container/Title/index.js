import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { titleClickarea } from '../../../../actions/clickarea';
import classnames from 'classnames';
import ContentEditable from 'react-contenteditable';
import styles from './styles/styles.css';

export default class CreateClickarea extends Component {

	constructor (props) {
		super(props);

		this.state = {
			html: '',
			disabled: false,
			scope: 'project'
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
	}

	componentDidMount () {
		document.getElementById('editable')
			.setAttribute('placeholder', 'Please name ' + this.props.scope);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.scope === 'project') {
			var title = nextProps.projectName;
		} else {
			title = (typeof nextProps.views[nextProps.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[nextProps.coordIndex] === 'undefined')
				? 'Figure Title' : nextProps.views[nextProps.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[nextProps.coordIndex].goTo;
		}

		document.getElementById('editable')
			.setAttribute('placeholder', 'Please name ' + nextProps.scope);

		this.setState({
			html: title,
			scope: nextProps.scope
		}, () => {
			if (title !== '') {
				var el = document.getElementById('editable');
				var range = document.createRange();
				var sel = window.getSelection();
				range.setStart(el.childNodes[0], el.childNodes[0].length);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
				el.focus();
			}
		});
	}

	handleChange (e) {
		e.preventDefault();
		let scope = ($('.overlay').hasClass('selected'))
			? 'figure' : 'project';

		this.setState({
			html: e.target.value,
			scope: scope
		}, () => {
			this.props.dispatch(titleClickarea(this.state));
		});
	}

	handleBlur (e) {
		e.preventDefault();
	}

	handleFocus (e) {
		e.preventDefault();
	}

	render () {
		const textfieldClass = classnames({
			'textfield': true,
			[styles.textfield]: true
		});

		const titleWrapper = classnames({
			'titleWrapper': true,
			[styles.titleWrapper]: true
		});

		const titleLabel = classnames({
			'titleLabel': true,
			[styles.titleLabel]: true
		});

		return (
			<div className={titleWrapper}>
				<label className={titleLabel}>{this.state.scope}</label>
				<ContentEditable
					id="editable"
					disabled={this.state.disabled}
					html={this.state.html}
					onChange={(e) => this.handleChange(e)}
					onFocus={(e) => this.handleFocus(e)}
					onBlur={(e) => this.handleBlur(e)}
					className={textfieldClass}
				/>
			</div>
		);
	}
}

CreateClickarea.propTypes = {
	dispatch: PropTypes.func
};

const mapStateToProps = (state) => {
	return {
		coordIndex: state.clickareas.coordIndex,
		currentView: state.clickareas.currentView,
		isSelected: state.clickareas.isSelected,
		views: state.clickareas.views,
		addLayer: state.clickareas.addLayer,
		initLayer: state.clickareas.initLayer,
		viewUpdate: state.clickareas.viewUpdate,
		scope: state.clickareas.scope,
		projectName: state.clickareas.projectName
	};
};

export default connect(mapStateToProps)(CreateClickarea);
