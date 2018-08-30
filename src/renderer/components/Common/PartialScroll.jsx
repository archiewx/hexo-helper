import styled from 'styled-components'

const PartialScroll = styled.div`
  width: 100%;
  height: ${props => props.height + 'px'};
  overflow: auto;
`

export default PartialScroll
