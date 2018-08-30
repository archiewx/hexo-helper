// 数据接口
const mapApi = {
  buckets: 'http://rs.qbox.me/buckets',
  bucketDomain: 'http://api.qiniu.com/v6/domain/list'
}

export default function apiUrl(area) {
  if (mapApi[area]) {
    return mapApi[area]
  }
}
