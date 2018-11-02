const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

var clients = [];

app.use(express.static(__dirname + '/assets'))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/login.html`)
})

app.get('/room', (req, res) => {
  res.sendFile(`${__dirname}/views/chat.html`)
})

io.on('connection', socket => {
  socket.on('userJoin', user => {
      socket.id = user.name
      clients.push({ ID: user.ID, name: user.name })
      io.emit('userJoin', clients)
      console.log(`${socket.id} bergabung`)
  })

  socket.on('chat', chat => {
    io.emit('chat', chat)
  })

  socket.on('disconnect', () => {
    if (!socket.id) return

    clients.splice(clients.findIndex(c => c.name === socket.id), 1)
    io.emit('userJoin', clients)
    io.emit('disconnect', clients)
  })
})

http.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING!'))