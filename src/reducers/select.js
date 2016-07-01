import { handleActions } from 'redux-actions'

export default handleActions({
  SELECT: (state, action) => ({
    ...state,
    ...action.payload
  })
}, {
  selected: 'Yip'
})
