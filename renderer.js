// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import React from 'react'
import ReactDom from 'react-dom'
import './src/styles/app.scss'

ReactDom.render(
  <div>
    <div>
      <p>Hello World</p>
      <img src="./assets/xpic6813.jpg" />
    </div>
  </div>,
  document.querySelector('#root')
)
