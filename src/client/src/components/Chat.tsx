import React, { FormEvent, useEffect, useState } from 'react'
import io from 'socket.io-client'

type ChatMessage = {
  username: string, msg: string
}

const socket = io()

const Game = () => {
  const [messages, setMessages] = useState<Array<ChatMessage>>([{ username: "zan", msg: "hi" }, { username: "mirsko", msg: "Hllo" }])
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat-message', (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, []);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget)
    const msg = formData.get("message")

    socket.emit('chat-message', {
      username: "zan",
      msg: msg
    });
  }


  return (
    <div className='flex flex-col gap-1 absolute right-2 bottom-2 w-60 h-80 bg-black bg-opacity-20 rounded-md p-4 text-white'>
      <div id="chatHeader">
        <p className='font-bold'>Chat</p>
        < hr />
      </div>

      <div id="messageBox" className='flex-1 overflow-x-hidden overflow-y-scroll'>
        {messages.map(msg => {
          return (
            <p key={Math.random()}>{msg.username}: {msg.msg}</p>
          )
        })}
      </div>

      <form onSubmit={handleSendMessage} id="chatMessageInput" className='flex gap-2 items-center justify-between w-full' action=''>
        <input autoComplete='false' autoSave='false' type="text" id="usernameInput" className='w-full text-black rounded-md px-2' name="message"></input>
        <button type='submit' className='rounded-md m-0 px-2 text-sm h-full bg-gray-300 text-gray-800 hover:bg-green-700 hover:text-white transition-all duration-100'>SEND</button>
      </form>
    </div>
  )
}

export default Game