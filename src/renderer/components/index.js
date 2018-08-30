import styled from 'styled-components'

export const Panel = styled.div`
  padding: 10px;
`

export const Inline = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
`

export const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500;
`

const colorsMap = {
  success: '#7cb305',
  error: '#ff7875',
  normal: '#1890ff'
}

export const StateLinkText = styled.a`
  color: ${props => colorsMap[props.status] || colorsMap.normal};
`
