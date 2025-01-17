import { useState } from 'react'
import reactLogo from './assets/coin.png'
import './App.css'

function App() {
  return (
    <>
      <div>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Bit Pay</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Log In
        </button>
        <button onClick={() => setCount((count) => count + 1)}>
          Sign Up
        </button>
      </div>
    </>
  )
}

export default App
