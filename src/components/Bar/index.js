import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { selectAction, createItem } from '../../actions'

export class Bar extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: null,
      description: null
    }
  }

  handleSelect (event) {
    this.props.dispatch(selectAction({
      selected: event.target.value
    }))
  }

  handleSubmit (event) {
    event.preventDefault()

    this.props.dispatch(createItem(this.state))
  }

  render () {
    return (
      <div>
        <h1>Bar</h1>
        <nav>
          <Link to="/foo">Foo</Link>
        </nav>
        <select
            ref='dropdown'
            value={this.props.selected}
            onChange={this.handleSelect.bind(this)}>

            <option value='Yip'>Yip</option>
            <option value='Yap'>Yap</option>
          </select>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            onChange={e => this.setState({name: e.target.value})} />

          <label htmlFor='description'>Description</label>
          <input
            id='description'
            type='text'
            onChange={e => this.setState({description: e.target.value})} />

          <button type='submit'>Add item</button>
        </form>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    dispatch: state.dispatch,
    selected: state.select.selected
  }
}

export default connect(mapStateToProps)(Bar)
