import React, { Component } from 'react'
import { Consumer } from './context'
import pathToRegexp from 'path-to-regexp'

export default class Route extends Component {

  render () {
    return (<Consumer>
      {(value)=>{
				let {location: {pathname}} = value
				let {path = '/', exact = false, component: Component, render, children} = this.props
				let keys = []
				let reg = pathToRegexp(path, keys, {end: exact})
				let props = value
				let matches = pathname.match(reg)
				if (matches) {
					props.match = {
						params: keys.reduce((memo, key, index)=>{
							memo[key.name] = matches[index+1]
							return memo
						}, {})
					}
					if (Component) {
						return <Component {...props}></Component>
					} else if (render) {
						return render(props)
					} else if (children) {
						return children(props)
					} else {
						return null
					}
				} else {
					if (children) {
						return children(props)
					}
					return null
				}
			}}
    </Consumer>)
  }
}