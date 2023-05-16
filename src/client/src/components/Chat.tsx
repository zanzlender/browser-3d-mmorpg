"use-client"

import { FormEvent, MutableRefObject, useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

type ChatMessage = {
  username: string, msg: string, timestamp: number
}

const Game = () => {
  const [currentSocket, setSocket] = useState<Socket>()
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [isConnected, setIsConnected] = useState(currentSocket?.connected);
  const messageInputRef = useRef() as MutableRefObject<HTMLInputElement>
  const messagesContainerRef = useRef() as MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_MAIN_SERVER_HOST)
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [setSocket]);

  useEffect(() => {
    currentSocket?.on('connect', () => {
      setIsConnected(true);
    });

    currentSocket?.on('disconnect', () => {
      setIsConnected(false);
    });

    currentSocket?.on('chat-message', (data: ChatMessage) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      currentSocket?.off('connect');
      currentSocket?.off('disconnect');
    };
  }, [currentSocket])

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const msgInputValue = messageInputRef.current.value

    if (msgInputValue.length === 0)
      return

    const msg = {
      username: "zan",
      msg: msgInputValue,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, msg])

    currentSocket?.emit('chat-message', msg);

    messageInputRef.current.value = ""
    messageInputRef.current.focus()
  }

  // Scroll to end of the messages in chat when a new message is recorded
  useEffect(() => {
    messagesContainerRef.current.scrollTo({
      behavior: "smooth",
      left: 0,
      top: messagesContainerRef.current.scrollHeight
    })
  }, [messages])

  return (
    <div className='z-50 flex flex-col gap-1 absolute right-2 bottom-2 w-60 h-80 bg-black bg-opacity-20 rounded-md p-4 text-white'>
      <div id="chatHeader">
        <p className='font-bold'>Chat <span className='font-regular text-sm'>{isConnected ? "(connected)" : "(connecting...)"}</span></p>
        < hr />
      </div>

      <div ref={messagesContainerRef} id="messageBox" className='flex-1 overflow-x-hidden overflow-y-scroll'>
        {messages.map(msg => {
          return (
            <p key={Math.random()}>{msg.username}: {msg.msg}</p>
          )
        })}
      </div>

      <form onSubmit={handleSendMessage} id="chatMessageInput" className='flex gap-2 items-center justify-between w-full' action=''>
        <input ref={messageInputRef} placeholder={"Message..."} autoComplete='false' autoSave='false' type="text" id="usernameInput" className='w-full text-black rounded-md px-2' name="message"></input>
        <button type='submit' className='rounded-md m-0 px-2 text-sm h-full bg-gray-300 text-gray-800 hover:bg-green-700 hover:text-white transition-all duration-100'>SEND</button>
      </form>
    </div>
  )
}

export default Game