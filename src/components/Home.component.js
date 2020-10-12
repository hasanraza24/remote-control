import React, { Component } from 'react'
import { throttle } from 'lodash'
import socket from '../utils/socket'

const buttons = {
  0: 'left',
  1: 'right'
}

class Home extends Component {
  constructor (props) {
    super(props)
    this.lastX = null
    this.lastY = null
    this.state = {
      logs: ''
    }
    this.textLog = React.createRef()
    this.timeOut = null
    this.handleMouseMove = (event) => { throttle(this.handleMouseMoveCustom(event), 10) }
    this.handleTouchMove = (event) => { throttle(this.handleTouchMoveCustom(event), 10) }
  }

  handleMouseEnter ({ clientX, clientY }) {
    this.eventLog('MouseEnter')
    this.lastX = clientX
    this.lastY = clientY
  }

  handleMouseMoveCustom ({ clientX, clientY }) {
    this.handleMouse(clientX, clientY)
  }

  handleTouchMoveCustom (event) {
    event.preventDefault()
    const touchPos = event.touches[0]
    const isScroll = event.touches.length > 1
    const clientX = touchPos.clientX
    const clientY = touchPos.clientY
    this.handleMouse(clientX, clientY, isScroll)
  }

  handleMouse (clientX, clientY, isScroll) {
    this.eventLog(`Mouse:${clientX}-${clientY}`)
    const x = clientX - this.lastX
    const y = clientY - this.lastY
    this.lastX = clientX
    this.lastY = clientY
    socket.mouseMove({ x, y, isScroll })
  }

  handleTouchStart (event) {
    event.persist()
    this.eventLog('TouchStart')
    const touchPos = event.touches[0]
    this.lastX = touchPos.clientX
    this.lastY = touchPos.clientY
    clearTimeout(this.timeOut)
    this.timeOut = setTimeout(() => event.preventDefault(), 100)
  }

  handleTouchEnd () {
    this.eventLog('TouchEnd')
    clearTimeout(this.timeOut)
  }

  handleClick (event) {
    this.eventLog('Click')
    socket.mouseClick({ button: buttons[event.button], double: false })
  }

  handleDoubleClick (event) {
    this.eventLog('DoubleClick')
    socket.mouseClick({ button: buttons[event.button], double: true })
  }

  handleClickBtn (btn) {
    this.eventLog('ClickBtn')
    socket.mouseClick({ button: btn, double: true })
  }

  eventLog (message) {
    message = message.toString()
    message = message.trim()
    console.log(message)
    // eslint-disable-next-line quotes
    const logMessage = this.state.logs + "\n" + message
    this.setState({
      logs: logMessage
    })
    this.textLog.current.scrollTop = this.textLog.current.scrollHeight
    socket.eventLog({ message: message })
  }

  render () {
    /* eslint jsx-quotes: ["error", "prefer-double"] */
    return (
      <div className="home-container">
        <div
          className="touch-container"
          onMouseEnter={(event) => this.handleMouseEnter(event)}
          onMouseMove={(event) => this.handleMouseMove(event)}
          onTouchStart={(event) => this.handleTouchStart(event)}
          onTouchEnd={(event) => this.handleTouchEnd(event)}
          onTouchMove={(event) => this.handleTouchMove(event)}
          onDoubleClick={(event) => this.handleDoubleClick(event)}
          onClick={(event) => this.handleClick(event)}
          onKeyPressCapture={(event) => this.handleLongPress(event)}
        >
          <img width="50" height="50" alt="mouse" src="/images/mouse.png" />
        </div>
        <div className="buttons">
          <button className="btn" onClick={() => this.handleClickBtn('left')}>Left</button>
          <textarea className="logs" ref={this.textLog} rows="4" cols="50" value={this.state.logs} disabled />
          <button className="btn" onClick={() => this.handleClickBtn('right')}>Right</button>
        </div>
      </div>
    )
  }
}

export default Home
