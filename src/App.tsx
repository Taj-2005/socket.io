import React, { useEffect, useRef, useState } from "react"
import {io, Socket} from "socket.io-client"

function App() {
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const message = useRef<HTMLInputElement>(null)
  const room = useRef<HTMLInputElement>(null)

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!socket || !message.current?.value) return;
    socket.emit('send-message', message.current.value, room.current?.value)
    message.current!.value = ""
    return
  }

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    socket?.emit('join-room', room.current?.value, (msg: string) => {
      setMessages((msgs) => [...msgs, msg])
    })
    return
  }

  useEffect(() => {
    const socket = io(SOCKET_URL)
    socket.on("connect", () => {
      setMessages((msgs) => [...msgs, `Connected with id: ${socket.id}`])
    })
    socket.on("receive-message", (msg: string) => {
      setMessages((msgs) => [...msgs, msg])
    })
    setSocket(socket)
  }, [])

  return (
    <div className="min-h-screen max-h-screen flex flex-col justify-center items-center">
        <div className="w-100 h-100 border border-gray-500 rounded-2xl mb-4">
          <div className="p-4 h-64 w-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${index % 2 == 0 ? "bg-white": "bg-gray-100 px-4 py-2 rounded-xl"}`}>
                {msg}
              </div>
            ))}
          </div>
        </div>
        <form
        className="flex gap-2 justify-center items-center mb-4"
        onSubmit={handleSend}>
          <label>Message</label>
          <input 
          ref={message}
          type="text"
          placeholder="Enter your message..."
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 focus:text-black"
          />
          <button 
          type="submit"
          className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          >
            Send
          </button>
        </form>
        <form
        className="flex gap-2 justify-center items-center mb-4"
        onSubmit={handleJoin}>
          <label>Room</label>
          <input 
          ref={room}
          type="text" 
          placeholder="Enter your message..."
          className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 focus:text-black"
          />
          <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Join
          </button>
        </form>
    </div>
  )
}

export default App
