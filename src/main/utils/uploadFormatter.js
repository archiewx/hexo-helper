/**
 * 组织上传头信息
 */
module.exports = function uploadFormatter(params, options) {
  const boundary =
    options.boundary || parseInt(Math.random() * Number.MAX_SAFE_INTEGER, 10).toString(16)
  const extraData = Object.keys(params).map(key => {
    return `\r\n--${boundary}\r\nContent-Disposition:form-data;name="${key}"\r\n\r\n${params[key]}`
  })
  extraData.push(
    `\r\n--${boundary}\r\nContent-Disposition:form-data;name="file";filename="${
      options.filename
    }"\r\nContent-Type:application/octet-stream\r\n\r\n`
  )
  const endTempBuf = Buffer.from(`\r\n--${boundary}--`)
  const postDataBuf = Buffer.concat([Buffer.from(extraData.join('')), options.file, endTempBuf])
  return postDataBuf
}
