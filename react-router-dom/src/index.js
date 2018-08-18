import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {HashRouter as Router, Route, Link, Switch, Redirect} from './react-router-dom'
import Home from './components/Home'
import User from './components/User'
import Profile from './components/Profile'
import NotFound from './components/NotFound'

class App extends Component {
  render () {
    return <Router>
      <div>
        <div>
          <Link to="/">首页</Link>&nbsp;
          <Link to="/user">用户</Link>&nbsp;
          <Link to="/profile">个人中心</Link>
        </div>
        <br/>
        <div>
          <Switch>
            <Route path="/" exact={true} component={Home}></Route>
            <Route path="/profile" component={Profile}></Route>
            <Route path="/user" component={User}></Route>
            <Route path="/404" component={NotFound}></Route>
            <Redirect to="/404"></Redirect>
          </Switch>
        </div>
      </div>
    </Router>
  }
}

ReactDOM.render(<App></App>, document.getElementById('root'))
