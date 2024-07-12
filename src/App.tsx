import NFTOwner from '@components/NFTOwner'
import NFTMetadata from './components/NFTMetadata'

const App = () => {

  return (
    <div>
      <h1 className='text-3xl font-bold underline'>NFT Metadata Viewer</h1>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <NFTOwner />
      <NFTMetadata />
    </div>
  )
}

export default App
