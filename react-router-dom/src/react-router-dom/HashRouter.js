import React, { Component }  from 'react'
import { Provider } from './context'

export default class HashRouter extends Component {
  state = {
    location: {
      pathname: window.location.hash ? window.location.hash.slice(1) : '/' 
    }
  }
  componentDidMount () {
    window.location.hash = window.location.hash ? window.location.hash.slice(1) : '/' 
    window.addEventListener('hashchange', () => {
      this.setState({
        location: {
          ...this.state.location,
          pathname: window.location.hash ? window.location.hash.slice(1) : '/' 
        }
      })
    })
  }
  render () {
    let value = {
      ...this.state,
      history: {
        push (to) {
          // to 可以是字符串，也可以是对象
          if (typeof to === 'object') {
            let {pathname, state} = to
            value.location.state = state
            window.location.hash = pathname
          } else {
            window.location.hash = to
          }
        }
      }
    }
    return (<Provider value={value}>
      {this.props.children}
    </Provider>)
  }
}