import React, { Component } from 'react'
import { Consumer } from './context'
import { bindActionCreators } from '../redux'

let connect = (mapStateToProps, mapDispatchToProps) => (Comp) => {
  class Proxy extends Component {
    state = mapStateToProps(this.props.store.getState())
    componentDidMount () {
      this.props.store.subscribe(() => {
        this.setState(mapStateToProps(this.props.store.getState()))
      })
    }
    render () {
      let stateProps = this.state
      let dispatchProps
      if (typeof mapDispatchToProps === 'object') {
        dispatchProps = bindActionCreators(mapDispatchToProps, this.props.store.dispatch)
      } else {
        dispatchProps = mapDispatchToProps(this.props.store.dispatch)
      }
      return <Comp {...stateProps} {...dispatchProps}></Comp>
    }
  }
  return () => <Consumer>
    {(store) => {
      return <Proxy store={store}></Proxy>
    }}
  </Consumer>
}

export default connect