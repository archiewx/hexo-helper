import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import electron from 'electron'
import { Upload, Icon, Button, message, List, Avatar, Divider } from 'antd'
import { Panel, Inline } from '@/components'
import notification from '@/wrappers/NotificationWrapper'
import navigateIpcRender from '@/wrappers/navigateIpcRender'
// import { readDefaultBucketAsync, readDefaultOss } from '../../store/conf/actions'
import { requestUploadTokenAsync } from '../../store/qiniu/actions'
import PartialScroll from '../../components/Common/PartialScroll'

const ipcRenderer = electron.ipcRenderer
const clipboard = electron.clipboard

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {},
      uploadToken: '',
      uploadParams: {
        token: '',
        key: ''
      },
      defaultBucket: null
    }
  }

  // 跳转去设置
  handleToSetting = () => {
    this.props.history.push('/settings')
  }

  // 跳转去文件列表
  handleToFileList = () => {
    if (this.state.defaultBucket && this.state.defaultBucket.area) {
      this.props.history.push('/file-list')
    } else {
      message.warn('请先完善默认的bucket的所属地区')
    }
  }

  componentDidMount() {
    // this.props.dispatch(readDefaultOss())
    // this.props.dispatch(readDefaultBucketAsync())
    navigateIpcRender.navigate(this.props.history)
  }
  componentWillUnmount() {
    navigateIpcRender.unmount()
  }

  getUploadOptions() {
    const dispatch = this.props.dispatch
    const accessKey = this.state.config.accessKey
    const secretKey = this.state.config.secretKey
    const confPrefix = this.state.config.prefix
    const that = this
    return {
      name: 'file',
      multiple: true,
      listType: 'picture',
      showUploadList: false,
      // action: '//jsonplaceholder.typicode.com/posts/',
      action:
        this.state.defaultBucket &&
        this.state.defaultBucket.area &&
        this.state.defaultBucket.area.web,
      data: this.state.uploadParams,
      beforeUpload() {
        const key = `${confPrefix}/${Date.now()}.jpeg`
        return new Promise((resolve, reject) => {
          if (!that.state.defaultBucket) {
            notification.fail({ title: '上传失败', body: '请设置默认的bucket' })
            return reject()
          }

          // todo:未来修改, 破坏了统一的api管理
          dispatch(
            requestUploadTokenAsync(accessKey, secretKey, key, that.state.defaultBucket.name)
          ).then(action => {
            const token = action.token
            that.setState(
              {
                uploadParams: {
                  token,
                  key
                }
              },
              () => {
                resolve()
              }
            )
          })
        })
      },
      onChange(info) {
        const file = info.file
        const status = file.status
        if (status !== 'uploading') {
          const percent = Number(event.percent / 100).toFixed(2)
          ipcRenderer.send('uploading', isNaN(percent) ? -1 : percent)
        }
        if (status === 'done') {
          const imgUrl = `http://${that.state.defaultBucket && that.state.defaultBucket.domain}/${
            that.state.uploadParams.key
          }`
          notification.success({ title: '上传成功', body: `已复制到粘贴板上了，地址为: ${imgUrl}` })
          clipboard.writeText(imgUrl)
          // ipcRenderer.send('upload-done')
        } else if (status === 'error') {
          notification.fail({ title: '上传失败', body: '请稍后重试，或者联系作者帮助' })
          // ipcRenderer.send('upload-done')
        }
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const props = this.props
    if (props.conf.defaultOss !== nextProps.conf.defaultOss) {
      this.setState({
        config: nextProps.conf.defaultOss
      })
    }
    if (props.qiniu.uploadToken !== nextProps.qiniu.uploadToken) {
      this.setState({
        uploadToken: nextProps.qiniu.uploadToken
      })
    }
    if (props.conf.defaultBucket !== nextProps.conf.defaultBucket) {
      this.setState({
        defaultBucket: nextProps.conf.defaultBucket
      })
    }
  }

  render() {
    const data = [
      { title: 'Ant Design Title 1' },
      { title: 'Ant Design Title 2' },
      { title: 'Ant Design Title 3' },
      { title: 'Ant Design Title 4' },
      { title: 'Ant Design Title 4' },
      { title: 'Ant Design Title 4' },
      { title: 'Ant Design Title 4' },
      { title: 'Ant Design Title 4' }
    ]
    return (
      <Panel>
        <p>
          hexo 写作助手
          <a style={{ float: 'right' }} onClick={this.handleToFileList}>
            文件列表
            <Icon type="arrow-right" />
          </a>
        </p>
        <Upload {...this.getUploadOptions()}>
          <Button>
            <Icon type="upload" />
            点击上传
          </Button>
        </Upload>
        <Inline>
          <a onClick={this.handleToSetting}>
            <Icon type="setting" />
            设置
          </a>
          <Divider type="vertical" />
          <a>
            <Icon type="setting" />
            其他功能
          </a>
          <Divider type="vertical" />
          <a>
            <Icon type="setting" />
            附加功能
          </a>
        </Inline>
        <PartialScroll height={420}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language "
                />
              </List.Item>
            )}
          />
        </PartialScroll>
      </Panel>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(Home))
