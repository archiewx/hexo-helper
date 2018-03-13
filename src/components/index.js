import styled from 'styled-components'

export const Panel = styled.div`
  padding: 10px;
`

export const Inline = styled.a`
  position: absolute;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
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
