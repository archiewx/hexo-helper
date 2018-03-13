import electron from 'electron'

const { ipcRenderer } = electron

export default {
  navigate(history) {
    ipcRenderer.on('navigate', (event, location) => {
      history.push(location)
    })
  },
  mount() {},
  unmount(channel = '') {
    ipcRenderer.removeAllListeners(channel)
  }
}
