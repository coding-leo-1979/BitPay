import { useEffect } from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './pages/Home';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wallet from './pages/Wallet';
import Send from './pages/Send';
import GenQR from './pages/GenQR';

function App() {
  const isLoggedIn = () => {
    return localStorage.getItem('publicKey') && localStorage.getItem('pin');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn() ? <Home /> : <Index />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/send" element={<Send />} />
        <Route path="/genQR" element={<GenQR />} />
      </Routes>
    </Router>
  );
}

export default App;