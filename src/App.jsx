import { useEffect } from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './pages/Home';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';

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
      </Routes>
    </Router>
  );
}

export default App;