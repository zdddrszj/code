import React, { Component } from 'react'
import store from '../store'
import actions from '../store/actions'

export default class Counter extends Component {
  state = {
    number: store.getState().counter.number
  }
  componentDidMount () {
    this.unsub = store.subscribe(() => {
      this.setState({
        number: store.getState().counter.number
      })
    })
  }
  componentWillUnmount () {
    this.unsub()
  }
  render () {
    return (<div>
       <button onClick={() => {
         store.dispatch(actions.add(1))
       }}>+</button>
       <div>{this.state.number}</div>
       <button onClick={() => {
         store.dispatch(actions.minus(1))
       }}>-</button>
    </div>)
  }
}