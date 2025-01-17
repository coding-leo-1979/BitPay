import { useNavigate } from 'react-router-dom';
import walletLogo from '../assets/coin.png';
import '../App.css';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <img src={walletLogo} className="logo wallet" alt="Wallet logo" />
      </div>
      <h1>Bit Pay</h1>
      <div className="card">
        <button onClick={() => navigate('/login')}>Log In</button>
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default Index;