import Home from './home'
import Settings from './settings'
import FileList from './fileList'
import QiniuSet from './qiuSets'
import QnyunAdd from './qnyunEdit'
import AliossSet from './aliyunOss'
import KeySettings from './keySettings'

export default [
  {
    path: '/',
    component: Home
  },
  {
    path: '/settings',
    component: Settings
  },
  {
    path: '/file-list',
    component: FileList
  },
  {
    path: '/qn-set',
    component: QiniuSet
  },
  {
    path: '/qn-edit',
    component: QnyunAdd
  },
  {
    path: '/key-settings',
    component: KeySettings
  },
  {
    path: '/alioss-set',
    component: AliossSet
  }
]
