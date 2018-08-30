const AuthLanch = require('auto-launch')
const hexoHelperAutoLancher = new AuthLanch({
  name: 'HexoHelper',
  path: '/Applications/HexoHelper.app'
})
module.exports = {
  enableAutoLanchApp() {
    hexoHelperAutoLancher.isEnabled().then(isEnabled => {
      !isEnabled && hexoHelperAutoLancher.enable()
    })
  },
  disabledAuthLanchApp() {
    hexoHelperAutoLancher.isEnabled().then(isEnabled => {
      isEnabled && hexoHelperAutoLancher.disable()
    })
  }
}
