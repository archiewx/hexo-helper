// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import React from 'react'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import logger from 'redux-logger'
import reduxThunk from 'redux-thunk'
import reducers from './src/store'
import App from './src/App'
import styled, { ThemeProvider } from 'styled-components'
import theme from 'styled-theming'
import axios from 'axios'

const boxBackgroundColor = theme('mode', {
  light: '#fff',
  dark: '#000'
})

const Box = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: ${boxBackgroundColor};
`

const store = createStore(reducers, applyMiddleware(reduxThunk, logger))

// 配置axios
axios.defaults.baseURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://util.wangxdog.cn'

ReactDom.render(
  <Provider store={store}>
    <ThemeProvider theme={{ mode: 'light' }}>
      <Box>
        <HashRouter>
          <App />
        </HashRouter>
      </Box>
    </ThemeProvider>
  </Provider>,
  document.querySelector('#root')
)
