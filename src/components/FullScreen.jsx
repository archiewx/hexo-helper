import styled from 'styled-components'

export default styled.div`
  width: 100%;
  height: 100%;
  display: ${props => (props.visible ? 'flex' : 'none')};
  position: absolute;
  background-color:  rgba(255,255,255, .8);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
