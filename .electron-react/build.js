/*
 * @Author: zhenglfsir@gmail.com
 * @Date: 2018-08-29 19:53:38
 * @Last Modified by: zhenglfsir@gmail.com
 * @Last Modified time: 2018-08-30 10:46:23
 */
process.env.NODE_ENV = 'production'

// const childProcess = require('child_process')
const webpack = require('webpack')
const chalk = require('chalk')
const Listr = require('listr')
const execa = require('execa')
const del = require('del')
const path = require('path')

const mainConfig = require('./webpack.config.main')
const rendererConfig = require('./webpack.config.renderer')
const packagerConfig = require('./packager.config')

const doneLog = chalk.bgGreen.white(' DONE ') + ' '
const errorLog = chalk.bgRed.white(' ERROR ') + ' '
const okayLog = chalk.bgBlue.white(' OKAY ') + ' '

const pack = function pack(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err)
      } else if (stats.hasErrors()) {
        let errors = ''
        stats
          .toString({
            chunks: false,
            colors: true,
          })
          .split(/\r?\n/)
          .forEach(line => {
            err += `    ${line}\n`
          })

        reject(err)
      } else {
        resolve(
          stats.toString({
            chunks: false,
            colors: true,
          })
        )
      }
    })
  })
}

const clean = args => del(args)

const packagerApp = () => {
  return new Promise((resolve, reject) => {
    packager(packagerConfig, (err, appPaths) => {
      if (err) {
        console.log(`\n${errorLog}${chalk.yellow('`electron-packager`')} says...\n`)
        console.log(err + '\n')
        reject(err)
      } else {
        console.log(`\n${doneLog}\n`)
        resolve()
      }
    })
  })
}

const build = function build() {
  const taskList = [
    {
      title: 'Clean Build Directory',
      task: () => clean([path.resolve(__dirname, '../dist')]),
    },
    {
      title: 'Renderer Build',
      task: () => {
        return pack(rendererConfig).then(result => {
          result += result + '\n\n'
          console.log('\n\n' + result)
        })
      },
    },
    {
      title: 'Main Build',
      task: () => {
        return pack(mainConfig).then(result => {
          result += result + '\n\n'
          console.log('\n\n' + result)
        })
      },
    }
  ]
  const tasks = new Listr(taskList)
  tasks.run().catch(err => {
    console.error(chalk.red(err))
  })
}

build()
