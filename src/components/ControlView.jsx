import styled from 'styled-components'
import PropTypes from 'prop-types'

const ControllView = styled.div`
  display: ${props => (props.show ? 'inline-block' : 'none')};
`
ControllView.propTypes = {
  show: PropTypes.bool
}
ControllView.defaultProps = {
  show: true
}

export default ControllView
