import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { selectAction, receiveItems, deleteItem } from '../../actions'

export class Foo extends Component {
  constructor (props) {
    super(props)
  }

  componentWillMount () {
    this.props.dispatch(receiveItems())
  }

  handleItemDelete (event) {
    event.preventDefault()

    this.props.dispatch(deleteItem(event.target.dataset.id))
  }

  render () {
    return (
      <div>
        <h1>Foo</h1>
        <nav>
          <Link to="/bar">Bar</Link>
        </nav>
        <p>Selected: {this.props.selected}</p>
        <ul>
          {this.props.items.map(item =>
            <li key={item._id}>
              <span>{item.name}</span>
              <button
                onClick={this.handleItemDelete.bind(this)}
                data-id={item._id}>
                  X
                </button>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    selected: state.select.selected,
    items: state.items.list
  }
}

export default connect(mapStateToProps)(Foo)
