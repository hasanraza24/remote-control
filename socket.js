const constants = require('./constants')

function handleSocketEvents (socket, robot) {
  socket.on(constants.MOUSE_MOVE, ({ x, y, isScroll }) => {
    console.log('Mouse move:', x, y, isScroll)
    if (!isScroll) {
      const { x: X, y: Y } = robot.getMousePos()
      robot.moveMouse(x + X, y + Y)
    } else {
      y = y > 0 ? 1 : -1
      robot.scrollMouse(0, y)
    }
  })

  socket.on(constants.MOUSE_CLICK, ({ button, double }) => {
    console.log('Mouse click:', button)
    robot.mouseClick(button, double)
  })

  socket.on(constants.EVENT_LOG, ({ message }) => {
    console.log('Event log:', message)
  })
}

module.exports = handleSocketEvents
