import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Icon, List, Avatar, Checkbox } from 'antd'
import BackHeader from '@/components/BackHeader'
import Section from '@/components/Section'
import { Panel, SmallText } from '@/components'
import Loading from '@/components/Loading'
import QiniuLogo from '@/assets/qnlogo.png'
import ControlView from '@/components/ControlView'
import qs from 'querystring'
import {
  readConfigAsync,
  readConfigBucketsAsync,
  writeConfigBucketsAsync
} from '../../store/conf/actions'
import { requestBucketsAsync } from '../../store/qiniu/actions'
import notice from '../../wrappers/NotificationWrapper'

class QiuSets extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      config: null,
      loading: {
        tips: props.conf.message,
        visible: true
      },
      manageToken: '',
      buckets: []
    }
  }

  componentDidMount() {
    this.props.dispatch(readConfigAsync())
  }

  componentWillReceiveProps(nextProps) {
    const dispatch = this.props.dispatch
    if (this.props.conf.config !== nextProps.conf.config) {
      const qiniu = nextProps.conf.config.qiniu
      this.setState(prevState => ({
        config: qiniu,
        loading: { ...prevState.loading, tips: '获取buckets' }
      }))
      dispatch(readConfigBucketsAsync())
    }
    if (this.props.conf.buckets !== nextProps.conf.buckets) {
      this.setState({
        loading: { tips: '获取成功', visible: false },
        buckets: nextProps.conf.buckets
      })
    }
    if (this.props.qiniu.buckets !== nextProps.qiniu.buckets) {
      // 判断获取到buckets, 更新config 中的buckets
      const buckets = nextProps.qiniu.buckets
      dispatch(writeConfigBucketsAsync('qiniu', buckets))
      this.setState({
        buckets: nextProps.qiniu.buckets
      })
      this.startTimeout('同步成功')
      notice.success({ title: '同步成功', body: '已经和云端bucket列表同步成功' })
    }
  }

  startTimeout(message) {
    this.setState(prevState => ({
      loading: { ...prevState.loading, tips: message }
    }))
    this.timerOut = setTimeout(() => {
      this.setState(prevState => ({
        loading: { ...prevState.loading, visible: false }
      }))
    }, 2000)
  }

  componentWillUnmount() {
    clearTimeout(this.timerOut)
  }

  toggleDefault(item) {
    this.setState(
      prevState => ({
        buckets: prevState.buckets.map(
          cv => (cv.name === item.name ? { ...cv, isDefault: true } : { ...cv, isDefault: false })
        )
      }),
      () => {
        this.props.dispatch(writeConfigBucketsAsync('qiniu', this.state.buckets))
      }
    )
  }

  // 获取服务器上的buckets, 然后写入配置文件
  handleAsyncBuckets() {
    this.setState({
      loading: { tips: '正在同步buckets', visible: true }
    })
    const accessKey = this.state.config.accessKey
    const secretKey = this.state.config.secretKey
    this.props.dispatch(requestBucketsAsync(accessKey, secretKey))
  }

  // 修改bucket的信息
  handleEditBucket(bucket) {
    this.props.history.push({
      pathname: '/qn-edit',
      search: qs.stringify(bucket)
    })
  }

  render() {
    return (
      <Panel>
        <BackHeader title="返回设置">
          <a style={{ float: 'right' }} onClick={this.handleAsyncBuckets.bind(this)}>
            <Icon type="sync" />
          </a>
        </BackHeader>
        <Section>
          <List
            size="small"
            dataSource={this.state.buckets}
            renderItem={item => (
              <List.Item
                actions={[
                  <ControlView>
                    <Checkbox
                      checked={item.isDefault}
                      onChange={this.toggleDefault.bind(this, item)}>
                      默认
                    </Checkbox>
                  </ControlView>
                ]}>
                <List.Item.Meta
                  avatar={<Avatar style={{ backgroundColor: '#1989FA' }} src={QiniuLogo} />}
                  title={<a onClick={this.handleEditBucket.bind(this, item)}>{item.name}</a>}
                  description={
                    <SmallText>
                      {item.area ? item.area.name + ':' + item.domain : item.domain}
                    </SmallText>
                  }
                />
                {/* <NoWrapLine title={item.domain}>{item.domain}</NoWrapLine> */}
              </List.Item>
            )}
          />
        </Section>
        <Loading {...this.state.loading} />
      </Panel>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(QiuSets))
