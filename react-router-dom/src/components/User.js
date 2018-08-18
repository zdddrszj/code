import React, {Component} from 'react'
import { Link, Route, Switch } from '../react-router-dom'
import UserAdd from './UserAdd'
import UserList from './UserList'
import UserDetail from './UserDetail'

export default class User extends Component {
  render () {
    return (<div style={{display:'flex'}}>
      <div>
        <Link to="/user/add">用户添加</Link><br/>
        <Link to="/user/list">用户列表</Link>
      </div>
      <div style={{marginLeft: '100px'}}>
        <Switch>
          <Route path="/user" exact={true} component={UserAdd}></Route>
          <Route path="/user/add" component={UserAdd}></Route>
          <Route path="/user/list" component={UserList}></Route>
          <Route path="/user/detail/:id" component={UserDetail}></Route>
        </Switch>
      </div>
    </div>)
  }
}
