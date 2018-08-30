import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Icon, List, Avatar, message } from 'antd'
import { Panel, SmallText, StateLinkText } from '@/components'
import BackHeader from '@/components/BackHeader'
import { setDefaultOss, readConfigAsync } from '../../store/conf/actions'

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'qiniu',
      config: null
    }
    // 将react组件传入调用函数
    this.handleToSets = this.handleToSets.bind(this)
    this.handleToKeySet = this.handleToKeySet.bind(this)
  }

  handleToggleAutoLanch() {
    // const checked = ev.target.checked
  }

  handleToggleType(type) {
    // 设置默认
    this.props.dispatch(setDefaultOss(type))
  }

  componentDidMount() {
    this.props.dispatch(readConfigAsync())
  }

  componentWillReceiveProps(nextProps) {
    const config = this.props.conf.config
    if (config !== nextProps.conf.config) {
      this.setState({
        config: nextProps.conf.config,
        type: nextProps.conf.config.qiniu.isDefault ? 'qiniu' : 'oss'
      })
    }
  }

  selectsSaveType() {
    const opts = []
    // opts.push(
    //   <StateLinkText
    //     status={this.state.type === 'oss' ? 'success' : 'normal'}
    //     onClick={this.handleToggleType.bind(this, 'oss')}>
    //     <Icon
    //       type="check"
    //       style={{ display: this.state.type === 'oss' ? 'inline-block' : 'none' }}
    //     />alioss
    //   </StateLinkText>
    // )
    opts.push(
      <StateLinkText
        status={this.state.type === 'qiniu' ? 'success' : 'normal'}
        onClick={this.handleToggleType.bind(this, 'qiniu')}>
        <Icon
          type="check"
          style={{ display: this.state.type === 'qiniu' ? 'inline-block' : 'none' }}
        />
        七牛
      </StateLinkText>
    )
    opts.push(<Icon type="right" onClick={this.handleToSets} />)
    return opts
  }

  handleToSets() {
    if (!this.checkSecretKey()) {
      message.warning('请先输入accessKey和secretKey')
      return
    }
    if (this.state.type === 'qiniu') {
      // 跳转去七牛云
      this.props.history.push('/qn-set')
    } else {
      // 跳转去阿里云
      this.props.history.push('/alioss-set')
    }
  }

  handleToKeySet() {
    this.props.history.push('/key-settings')
  }

  // 判断qiniu或者oss 是否有accessKey 和 secretKey
  checkSecretKey() {
    const config = this.state.config && (this.state.config['qiniu'] || this.state.config['oss'])
    if (config && config.accessKey && config.secretKey) {
      return true
    }
    return false
  }

  render() {
    return (
      <Panel>
        <BackHeader title="主页" />
        <List size="small" footer={<SmallText>一切还在继续</SmallText>}>
          {/* <List.Item actions={[<Checkbox onChange={this.handleToggleAutoLanch.bind(this)} />]}>
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="开机自启"
              description={<SmallText>启动个人计算器自动启动</SmallText>}
            />
          </List.Item> */}
          <List.Item actions={[<Icon type="right" onClick={this.handleToKeySet} />]}>
            <List.Item.Meta
              title="设置密钥"
              avatar={<Avatar icon="key" style={{ backgroundColor: '#333' }} />}
              description={<SmallText>设置云存储密钥accessKey、secretKey</SmallText>}
            />
          </List.Item>
          <List.Item actions={this.selectsSaveType()}>
            <List.Item.Meta
              avatar={<Avatar icon="cloud" style={{ backgroundColor: '#333' }} />}
              title="云服务"
              description={<SmallText>设置存储类型(阿里云对象存储或者七牛云存储)</SmallText>}
            />
          </List.Item>
          <List.Item style={{display: 'none'}}>
            <List.Item.Meta
              title="意见反馈"
              avatar={<Avatar icon="" style={{ backgroundColor: '#333' }} />}
            />
          </List.Item>
        </List>
      </Panel>
    )
  }
}

const mapStateToProps = state => state

export default withRouter(connect(mapStateToProps)(Settings))
