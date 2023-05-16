import React, { useState } from 'react'
import './App.css'
import Game from './components/Game'
import { PacmanLoader as Spinner } from 'react-spinners'

function App() {

  return (
    <div className="w-screen h-screen bg-zinc-800 flex justify-center items-center">
      <React.Suspense fallback={<Spinner color='white' size={50} />}>
        <Game />
      </React.Suspense>
    </div>
  )
}

export default App
