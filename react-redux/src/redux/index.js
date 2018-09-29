
const createStore = (reducer) => {
  let state = {}
  let listeners = []

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }
  // 订阅函数返回一个取消订阅的函数
  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(fn => fn !== listener)
    }
  }

  const getState = () => state

  // 将状态改成默认值
  dispatch({type: '@INIT'})

  return {
    dispatch,
    subscribe,
    getState
  }
}

const combineReducers = (reducers) => {
  return (state={}, action) => {
    let obj = {}
    for (let key in reducers) {
      obj[key] = reducers[key](state[key], action)
    }
    return obj
  }
}

const bindActionCreators = (actions, dispatch) => {
  let obj = {}
  for (let key in actions) {
    obj[key] = (...args) => {
      dispatch(actions[key](...args))
    }
  }
  return obj
}

export {
  createStore,
  combineReducers,
  bindActionCreators
}