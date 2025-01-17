import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import '../App.css';

function Login() {
    const [pin, setPin] = useState('');
    const [walletFile, setWalletFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => setWalletFile(e.target.files[0]);

    const handleLogin = () => {
        if (walletFile && pin) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const wallet = JSON.parse(e.target.result);
                try {
                    // 암호화된 공개 키와 개인 키 복호화
                    const decryptedPublicKey = CryptoJS.AES.decrypt(wallet.encryptedPublicKey, pin).toString(CryptoJS.enc.Utf8);
                    const decryptedPrivateKey = CryptoJS.AES.decrypt(wallet.encryptedPrivateKey, pin).toString(CryptoJS.enc.Utf8);

                    // 로그인 성공 시 localStorage에 저장하고 홈으로 이동
                    localStorage.setItem('publicKey', decryptedPublicKey);
                    localStorage.setItem('privateKey', decryptedPrivateKey); 
                    localStorage.setItem('pin', pin);
                    navigate('/home');
                } catch (error) {
                    alert('Incorrect PIN or corrupted wallet file.');
                }
            };
            reader.readAsText(walletFile);
        } else {
            alert('Please provide both a wallet file and PIN.');
        }
    };

    return (
        <div>
            <h1>Bit Pay</h1>
            <h3>Log In</h3>
            <div>
                <input type="file" accept=".json" onChange={ handleFileChange } />
                <input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                />
            </div>
            <div className="card">
                <button onClick={ handleLogin }>Log In</button>
            </div>
        </div>
    );
}

export default Login;