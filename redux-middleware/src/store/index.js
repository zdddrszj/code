import { createStore, compose, applyMiddleware} from '../redux'
import reducers from './reducers'
// import reduxThunk from 'redux-thunk'
// import reduxPromise from 'redux-promise'

// let store = createStore(reducers)
// export default store

// logger中间件：派发前后打印日志
let logger = (store) => (dispatch) => (action) => {
  console.log(store.getState())
  dispatch(action)
  console.log(store.getState())
}

// reduxThunk中间件：实现异步派发
let reduxThunk = (store) => (dispatch) => (action) => {
  // 如果action是一个对象
  if (typeof action === 'object') {
    dispatch(action)
    return
  }
  // 如果是一函数，则将dispath权限传递给该函数，让其自行dispatch
  if (typeof action === 'function') {
    action(dispatch, store.getState)
  }
}

// reduxPromise中间件：实现异步派发
let reduxPromise = (store) => (dispatch) => (action) => {
  if (typeof action.then === 'function') {
    // action.then(action => dispatch(action))
    action.then(dispatch)
    return
  }
  if (action.payload && typeof action.payload.then === 'function') {
    action.payload.then((data) => {
      dispatch({...action, payload: data})
      return
    }).catch (err => {
      dispatch({...action, payload: err})
      return
    })
    return
  }
  dispatch(action)
}



// export default applyMiddleware(logger, reduxThunk, reduxPromise)(createStore)(reducers)
export default createStore(reducers, applyMiddleware(logger, reduxThunk, reduxPromise))