const {instrument} = require('@socket.io/admin-ui')
require('dotenv').config()
const FRONTEND_URL = process.env.FRONTEND_URL
const PORT = process.env.PORT || 3000
const io  = require('socket.io')(PORT,{
    cors: {
        origin: [FRONTEND_URL, 'https://admin.socket.io'],
        credentials: true
    }
});


io.on('connection', socket => {
    console.log(socket.id)
    socket.on('send-message', (message, room) => {
        if (room === ""){
            socket.broadcast.emit('receive-message', message)
        }else{
            socket.broadcast.to(room).emit('receive-message', message)
        }
    })
    socket.on('join-room', (room, cb) => {
        socket.join(room)
        cb(`Joined room: ${room}`)
    })
})

instrument(io, { 
  auth: {
    type: "basic",
    username: process.env.ADMIN_USER,
    password: process.env.ADMIN_PASS,
  }
});