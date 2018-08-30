const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const childProcess = require('child_process')
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackDevServer = require('webpack-dev-server')

const mainConfig = require('./webpack.config.main')
const rendererConfig = require('./webpack.config.renderer')

let hotMiddleware = null
let electronProcess = null
let manualRestart = false

const logStats = function logStats(proc, data) {
  let log = ''

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array(19 - proc.length + 1).join('-')}`)
  log += '\n\n'

  if (typeof data === 'object') {
    data
      .toString({
        colors: true,
        chunks: false,
      })
      .split(/\r?\n/)
      .forEach(line => {
        log += '  ' + line + '\n'
      })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

  console.log(log)
}

const startRenderer = function startRenderer() {
  return new Promise(resolve => {
    rendererConfig.entry = [path.join(__dirname, 'dev-client')].concat(
      rendererConfig.entry.renderer
    )
    const complier = webpack(rendererConfig)
    hotMiddleware = webpackHotMiddleware(complier, {
      log: false,
      heartbeat: 2500,
    })
    complier.hooks.compilation.tap('compilation', compilation => {
      compilation.hooks.htmlWebpackPluginAfterEmit.tap(
        'html-webpack-plugin-after-emit',
        (data, cb) => {
          hotMiddleware.publish({ action: 'reload' })
        }
      )
    })
    complier.hooks.done.tap('done', stats => {
      logStats('Renderer', stats)
    })
    const webServer = new WebpackDevServer(complier, {
      contentBase: path.join(__dirname, '../'),
      quiet: true,
      before: (app, ctx) => {
        app.use(hotMiddleware)
        ctx.middleware.waitUntilValid(() => {
          resolve()
        })
      },
    })
    webServer.listen(9080)
  })
}

const startMain = function startMain() {
  return new Promise(resolve => {
    mainConfig.entry = [path.join(__dirname, '../src/main/main.dev.js')].concat(
      mainConfig.entry.main
    )

    const complier = webpack(mainConfig)

    complier.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      hotMiddleware.publish({ action: 'compiling' })
      done()
    })
    complier.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }
      logStats('Main', stats)

      if (electronProcess && electronProcess.kill) {
        process.kill(electronProcess.pid)
        manualRestart = true
        electronProcess = null
        startElectron()
        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }
      resolve()
    })
  })
}

const startElectron = function startElectron() {
  electronProcess = childProcess.spawn(electron, ['.'])
  electronProcess.stdout.on('data', data => {
    console.log(chalk.blue(data))
  })
  electronProcess.stderr.on('data', data => {
    console.log(chalk.red(data))
  })
  electronProcess.on('close', () => {
    !manualRestart && process.exit()
  })
}

const init = function init() {
  Promise.all([startRenderer(), startMain()])
    .then(() => {
      startElectron()
    })
    .catch(err => {
      console.error(err)
    })
}

init()
