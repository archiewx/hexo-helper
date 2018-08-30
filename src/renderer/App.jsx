import React from 'react'
// import { Route } from 'react-router-dom'
// import routes from './routes'
// import { TransitionGroup } from 'react-transition-group'
// import ErrorBoundary from './components/ErrorBoundary'
// import SwiperView from './components/SwipeView'
// import Loading from './components/Loading'
import './app.scss'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: {
        tips: '等待...',
        visible: false,
      },
    }
    this.onlineStatusChanged = this.onlineStatusChanged.bind(this)
  }

  componentDidMount() {
    window.addEventListener('online', this.onlineStatusChanged)
    window.addEventListener('offline', this.onlineStatusChanged)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.onlineStatusChanged)
    window.removeEventListener('offline', this.onlineStatusChanged)
  }

  onlineStatusChanged() {
    const online = navigator.onLine
    if (online) {
      this.setState({
        loading: {
          visible: false,
        },
      })
    } else {
      this.setState({
        loading: {
          visible: true,
          tips: '等待连接网络...',
        },
      })
    }
  }

  render() {
    return (
      <div className="fix-container">
        <div>Hello World</div>
      </div>
    )
  }
}
