import React, { Component } from 'react'
import { Link, Route } from '../react-router-dom'

export default class UserList extends Component {
  render () {
  return (<div>
      <Link to="/user/detail/1">用户1</Link><br/>
      <Link to="/user/detail/2">用户2</Link>  
  </div>)
  }
}