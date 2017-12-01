const express = require('express')
const http = require('http')
const WebSocket = require('ws')

import socketHost from './host'

const app = express()

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

socketHost(wss)

app.use(express.static('dist'))

server.listen(8264, function listening() {
  console.log('Listening on %d', server.address().port)
})
