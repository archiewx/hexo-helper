import React from 'react'
import { Route } from 'react-router-dom'
import Index from '../Index'
import routes from '@/routes'
import './app.scss'

export default class App extends React.Component {
  render() {
    return <div>{routes.map((route, idx) => <Route path={route.path} component={route.component} key={idx} />)}</div>
  }
}
