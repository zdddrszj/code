import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Counter from './components/Counter'


class App extends Component {
  render() {
    return (
      <div>
        <Counter></Counter>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
