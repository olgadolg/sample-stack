import React, { Component } from 'react';

import ControlContainer from '../../containers/Controls';
import Canvas from '../../containers/Canvas';

export default class Bonava extends Component {

	render() {
		return (
			<div className="wrapper">
				<ControlContainer />
				<Canvas />
			</div>
		);
	}
}
