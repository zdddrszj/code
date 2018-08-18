import React, { Component } from 'react'
import Route from './Route'

export default (Component) => {
  return () => <Route component={Component}></Route>
}