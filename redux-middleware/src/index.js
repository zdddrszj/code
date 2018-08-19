import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Counter from './components/Counter'
import Todo from './components/Todo'
import { Provider } from './react-redux'
import store from './store'


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          <Counter></Counter>
          <Todo></Todo>
        </React.Fragment>
      </Provider>
    )
  }
}

ReactDOM.render(<App></App>, document.getElementById('root'))
