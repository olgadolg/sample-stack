import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { titleClickarea } from '../../../../actions/clickarea';
import classnames from 'classnames';
import ContentEditable from 'react-contenteditable';
import styles from './styles/styles.css';

export default class CreateClickarea extends Component {

	constructor (props) {
		super(props);

		this.state = {
			html: 'Figure Title',
			disabled: true
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
	}

	componentWillReceiveProps (nextProps) {
		let title = (typeof nextProps.views[nextProps.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[nextProps.coordIndex] === 'undefined')
			? 'Figure Title' : nextProps.views[nextProps.currentView.replace(/(.*)\.(.*?)$/, '$1')].clickareas[nextProps.coordIndex].goTo;

		if (nextProps.isSelected === true && nextProps.addLayer === false && nextProps.initLayer === false && nextProps.viewUpdate === false) {
			this.setState({
				disabled: false,
				html: title
			}, () => {
				var el = document.getElementById('editable');
				var range = document.createRange();
				var sel = window.getSelection();
				range.setStart(el.childNodes[0], el.childNodes[0].length);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
				el.focus();
			});
		} else {
			this.setState({
				disabled: true,
				html: 'Figure Title'
			});
		}
	}

	handleChange (e) {
		e.preventDefault();
		this.setState({ html: e.target.value }, () => {
			if (this.state.html !== 'Figure Title') {
				this.props.dispatch(titleClickarea(this.state.html));
			}
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
		coordIndex: state.clickareas.coordIndex,
		currentView: state.clickareas.currentView,
		isSelected: state.clickareas.isSelected,
		views: state.clickareas.views,
		addLayer: state.clickareas.addLayer,
		initLayer: state.clickareas.initLayer,
		viewUpdate: state.clickareas.viewUpdate
	};
};

export default connect(mapStateToProps)(CreateClickarea);
