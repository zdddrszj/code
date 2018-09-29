
const createStore = (reducer, fn) => {
  let state = {}
  let listeners = []

  let dispatch = (action) => {
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

  if (typeof fn === 'function') {
    return fn(createStore)(reducer)
  }

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

const compose = (...fns) => {
  if (fns.length === 1) {
    return fns[0]
  }
  return fns.reduce((a, b) => (...args) => a(b(...args)))
}

const applyMiddleware = (...middlewares) => (createStore) => (reducers) => {
  const store = createStore(reducers)
  // 给中间件传递store参数
  const middles = middlewares.map(middleware => middleware(store))
  // 重新包装dispath函数
  const dispatch = compose(...middles)(store.dispatch)
  // 新的dispath覆盖旧的dispatch
  return {...store, dispatch}
}

export {
  createStore,
  combineReducers,
  bindActionCreators,
  compose,
  applyMiddleware
}