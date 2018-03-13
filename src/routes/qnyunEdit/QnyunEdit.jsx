import React from 'react'
import qs from 'querystring'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Input, Select, Button } from 'antd'
import { Panel } from '@/components'
import BackHeader from '@/components/BackHeader'
import storageArea from '@/config/storageArea'
import { writeBucketAsync, readBucket } from '../../store/conf/actions'

const FormItem = Form.Item
const Option = Select.Option

class QnyunEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      bucket: {}
    }
  }

  handleAreaChange(val) {
    const area = storageArea[val]
    this.setState(prevState => ({
      bucket: { ...prevState.bucket, area }
    }))
  }

  componentDidMount() {
    const history = this.props.history
    const { search } = history.location
    const bucket = qs.parse(search.split('?')[1])
    this.props.dispatch(readBucket('qiniu', bucket.name))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.conf.bucket !== nextProps.conf.bucket) {
      this.setState({
        bucket: nextProps.conf.bucket
      })
    }
  }

  handleSaveBucketRegion() {
    this.props.dispatch(writeBucketAsync('qiniu', this.state.bucket))
    this.props.history.go(-1)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Panel>
        <BackHeader title="返回" />
        <p>编辑七牛云bucket</p>
        <Form>
          <FormItem label="bucket">
            {getFieldDecorator('bucket', {
              rules: [{}],
              initialValue: this.state.bucket.name
            })(<Input disabled placeholder="输入bucket名称" />)}
          </FormItem>
          <FormItem label="选择地区">
            {getFieldDecorator('area', {
              initialValue: this.state.bucket.area && this.state.bucket.area.simple
            })(
              <Select placeholder="请选择bucket地区" onChange={this.handleAreaChange.bind(this)}>
                <Option value="z0">华东</Option>
                <Option value="z1">华北</Option>
                <Option value="z2">华南</Option>
                <Option value="na0">北美</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" className="btn" onClick={this.handleSaveBucketRegion.bind(this)}>
              保 存
            </Button>
          </FormItem>
        </Form>
      </Panel>
    )
  }
}

const mapStateToProps = state => state

export default withRouter(connect(mapStateToProps)(Form.create({})(QnyunEdit)))
