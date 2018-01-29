import electron from 'electron'

const remote = electron.remote
const { Notification } = remote

export function show(title, subtitle, body) {
  const notication = new Notification({
    title,
    subtitle,
    body
  })
  notication.show()
  return notication
}

export function openDialog() {}

export default {
  show
}
