import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { titleClickarea } from '../../../../../actions/clickarea';
import classnames from 'classnames';
import ContentEditable from 'react-contenteditable';
import styles from './styles/styles.css';

export default class CreateClickarea extends Component {

	constructor (props) {
		super(props);

		this.state = {
			html: 'Untitled Figure',
			disabled: true
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.isSelected === true) {
			this.setState({disabled: !nextProps.isSelected}, () => {
				var el = document.getElementById('editable');
				var range = document.createRange();
				var sel = window.getSelection();
				range.setStart(el.childNodes[0], el.childNodes[0].length);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
				el.focus();
			});
		}
	}

	handleChange (e) {
		e.preventDefault();
		this.setState({ html: e.target.value }, () => {
			this.props.dispatch(titleClickarea(this.state.html));
		});
	}

	handleBlur (e) {
		e.preventDefault();
		console.log(e.target);
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

		return (
			<div className={titleWrapper}>
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
		isSelected: state.clickareas.isSelected
	};
};

export default connect(mapStateToProps)(CreateClickarea);
