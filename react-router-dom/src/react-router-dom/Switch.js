import React, { Component } from 'react'
import { Consumer } from './context'
import pathToRegexp from 'path-to-regexp'

export default class Switch extends Component {
  render () {
    return (<Consumer>
      {(value)=>{
        let {location: {pathname}} = value
        let children = this.props.children
        for (let i = 0; i < children.length; i++) {
          let child = children[i]
          let {path='/', exact=false} = child.props
          let reg = pathToRegexp(path, [], {end: exact})
          if (pathname.match(reg)) {
            return child
          }
        }
        return null
      }}
    </Consumer>)
  }
}