import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import select from './select'
import items from './items'

export default combineReducers({
  routeReducer,
  select,
  items
})
