// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import React from 'react'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import logger from 'redux-logger'
import reduxThunk from 'redux-thunk'
import reducers from './src/store'
import App from './src/components/App'
import styled, { ThemeProvider } from 'styled-components'
import theme from 'styled-theming'

const boxBackgroundColor = theme('mode', {
  light: '#fff',
  dark: '#000'
})

const Box = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${boxBackgroundColor};
`

const store = createStore(reducers, applyMiddleware(reduxThunk, logger))

ReactDom.render(
  <Provider store={store}>
    <ThemeProvider theme={{ mode: 'light' }}>
      <Box>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  </Provider>,
  document.querySelector('#root')
)
