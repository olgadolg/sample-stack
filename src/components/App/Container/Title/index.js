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
			.setAttribute('placeholder', this.props.scope + ' name');
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.scope === 'project') {
			var title = nextProps.projectName;
		} else {
			title = (typeof nextProps.views[nextProps.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[nextProps.coordIndex] === 'undefined')
				? '' : nextProps.views[nextProps.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[nextProps.coordIndex].goTo;
		}

		document.getElementById('editable')
			.setAttribute('placeholder', nextProps.scope + ' name');

		this.setState({
			html: title,
			scope: nextProps.scope
		}, () => {
			this.setTextfieldCursorPosition(title);
		});
	}

	setTextfieldCursorPosition (title) {
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
	}

	handleChange (e) {
		e.preventDefault();
		this.setState({
			html: e.target.value,
			scope: this.props.scope
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

		console.log(this.state.scope, this.state.hml)

		return (
			<div className={titleWrapper}>
				<label className={titleLabel}>Title</label>
				<ContentEditable
					id="editable"
					disabled={this.state.disabled}
					html={this.state.html}
					onChange={(e) => this.handleChange(e)}
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
