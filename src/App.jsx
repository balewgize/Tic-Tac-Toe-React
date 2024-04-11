import { useState } from 'react'


function App() {
  function Square() {
    return <button className="square">X</button>;
  }

  return (
    <div>
      <Square />
    </div>
  )

}

export default App
