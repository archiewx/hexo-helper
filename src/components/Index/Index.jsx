import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Upload, Icon } from 'antd'
import { Panel, Inline } from '../Common'
import notification from '@/wrappers/NotificationWrapper'
import electron from 'electron'

const Dragger = Upload.Dragger
const ipcRenderer = electron.ipcRenderer

class Index extends React.Component {
  // 跳转去设置
  handleToSetting() {
    this.props.history.push('/settings')
  }

  // 跳转去文件列表
  handleToFileList() {
    this.props.history.push('/file-list')
  }

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    const options = {
      name: 'file',
      multiple: true,
      action: '//jsonplaceholder.typicode.com/posts/',
      onChange(info) {
        const status = info.file.status
        if (status !== 'uploading') {
          const percent = Number(event.percent / 100).toFixed(2)
          // ipcRenderer.send('uploading', isNaN(percent) ? -1 : percent)
        }
        if (status === 'done') {
          notification.show('OK', '非常Ok', '非常非常OK')
          // ipcRenderer.send('upload-done')
        } else if (status === 'error') {
          notification.show('NOT Ok', '非常Ok', '非常非常OK')
          // ipcRenderer.send('upload-done')
        }
      }
    }
    return (
      <Panel>
        <p>
          hexo 写作助手
          <a style={{ float: 'right' }} onClick={this.handleToFileList.bind(this)}>
            文件列表<Icon type="arrow-right" />
          </a>
        </p>
        <Dragger {...options}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或拖拽上传</p>
          <p className="ant-upload-hint">尽力开发中...</p>
        </Dragger>
        <Inline onClick={this.handleToSetting.bind(this)}>
          <Icon type="setting" />设置
        </Inline>
      </Panel>
    )
  }
}

export default withRouter(connect()(Index))
