import React from 'react'
import { CSSTransition } from 'react-transition-group'

export default class SwipeView extends React.Component {
  render() {
    return (
      <CSSTransition
        {...this.props}
        classNames="swiper"
        timeout={600}
        mountOnEnter={true}
        unmountOnExit={true}
      >
        {this.props.children}
      </CSSTransition>
    )
  }
}
