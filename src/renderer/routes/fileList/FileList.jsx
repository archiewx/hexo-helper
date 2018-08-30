import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { clipboard } from 'electron'
import { Panel, SmallText } from '@/components'
import Section from '@/components/Section'
import BackHeader from '@/components/BackHeader'
import { Icon, Row, Col, Card, Pagination, message } from 'antd'
import { requestFileAsync } from '../../store/qiniu/actions'
import { readDefaultBucketAsync } from '../../store/conf/actions'

class FileList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      marker: '',
      items: [],
      defaultBucket: null,
      lastTime: '',
      pagination: {
        total: 0,
        current: 1,
        pageSize: 9,
        size: 'small'
      },
      markers: {}
    }
    this.handleAsyncList = this.handleAsyncList.bind(this)
    this.handleChangePagination = this.handleChangePagination.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(readDefaultBucketAsync())
  }

  componentWillReceiveProps(nextProps) {
    const props = this.props
    if (props.conf.defaultBucket !== nextProps.conf.defaultBucket) {
      const bucket = nextProps.conf.defaultBucket
      this.setState({
        defaultBucket: bucket
      })
      this.props.dispatch(requestFileAsync(bucket.name, bucket.area.simple))
    }
    if (props.qiniu.fileListData !== nextProps.qiniu.fileListData) {
      const markers = this.state.markers
      const current = this.state.pagination.current
      const marker = nextProps.qiniu.fileListData.marker
      markers[current] = marker

      this.setState(prevState => ({
        items: nextProps.qiniu.fileListData.list,
        pagination: { ...prevState.pagination, total: nextProps.qiniu.fileListData.total },
        lastTime: nextProps.qiniu.fileListData.lastTime,
        marker,
        markers
      }))
    }
  }

  getListCard() {
    return this.state.items.map((item, idx) => (
      <Col key={idx} span={8}>
        <Card
          hoverable
          bodyStyle={{ padding: 0 }}
          onClick={this.handleClickImage.bind(this, item)}
          cover={
            <div style={{ overflow: 'hidden', height: 60, display: 'flex', alignItems: 'center' }}>
              <img src={item.url} style={{ width: '100%' }} />
            </div>
          }
          style={{ marginTop: 16 }}
        />
      </Col>
    ))
  }
  handleClickImage(item) {
    clipboard.writeText(item.url)
    message.success('成功复制到粘贴板上!')
  }

  handleAsyncList() {
    const bucket = this.state.defaultBucket
    this.setState(prevState => ({
      pagination: { ...prevState.pagination, current: 1 },
      markers: {}
    }))
    this.props.dispatch(requestFileAsync(bucket.name, bucket.area.simple))
  }

  handleChangePagination(page) {
    this.setState(
      prevState => ({
        pagination: { ...prevState.pagination, current: page }
      }),
      () => {
        const bucket = this.state.defaultBucket
        this.props.dispatch(
          requestFileAsync(bucket.name, bucket.area.simple, {
            marker: this.state.markers[page - 1]
          })
        )
      }
    )
  }

  stampToDate() {
    const stamp = parseInt(this.state.lastTime + '000')
    return new Date(stamp).toLocaleDateString()
  }

  render() {
    return (
      <Panel>
        <BackHeader title="主页">
          <a style={{ float: 'right' }} onClick={this.handleAsyncList}>
            <Icon type="sync" />
          </a>
        </BackHeader>
        <Section>
          <SmallText>最后一次上传时间{this.stampToDate()}</SmallText>
        </Section>
        <Section>
          <Row gutter={16}>{this.getListCard()}</Row>
        </Section>
        <Section>
          <Pagination {...this.state.pagination} onChange={this.handleChangePagination} />
        </Section>
      </Panel>
    )
  }
}

const mapStateToProps = state => state

export default withRouter(connect(mapStateToProps)(FileList))
