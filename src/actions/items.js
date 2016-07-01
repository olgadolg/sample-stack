export const receiveItems = () => (dispatch) => {
  const request = new XMLHttpRequest()
  request.open('GET', '/api/items', true)
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      dispatch({
        type: 'RECEIVE_ITEMS',
        payload: JSON.parse(request.responseText)
      })
    }
  }
  request.send()
}

export const createItem = (item) => (dispatch) => {
  const request = new XMLHttpRequest()
  request.open('POST', '/api/items', true)
  request.setRequestHeader('Content-Type', 'application/json')
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      dispatch({
        type: 'SAVE_ITEM',
        payload: JSON.parse(request.responseText)
      })
      window.alert('Item is saved')
    }
  }
  request.send(JSON.stringify(item))
}

export const deleteItem = (id) => (dispatch) => {
  const request = new XMLHttpRequest()
  request.open('DELETE', `/api/items/${id}`, true)
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      dispatch({
        type: 'DELETE_ITEM',
        payload: JSON.parse(request.responseText)
      })
    }
  }
  request.send()
}
