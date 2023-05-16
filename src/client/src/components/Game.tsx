import Chat from './Chat'
import Map from './Map'

const Game = () => {
  return (
    <div className='w-screen h-screen bg-purple-900 relative'>
      <Map />
      <Chat />
    </div>
  )
}

export default Game