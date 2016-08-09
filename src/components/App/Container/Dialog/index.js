import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles/styles.css';

export default class Dialog extends Component {

	render () {

		console.log('props.....', this.props)

		return (
			<div>
				<h2>{this.props.header}</h2>
				<div className="body">
					<p>{this.props.body}</p>
				</div>
				<button>Cancel</button>
				<button>Okey</button>
			</div>
		);
	}
}

export default connect()(Dialog);
