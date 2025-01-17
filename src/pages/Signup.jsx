import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';

import { API_CREATE_WALLET } from '../api';

function Signup() {
    const [pin, setPin] = useState('');
    const navigate = useNavigate();

    // 지갑 생성하기
    const handleCreateWallet = async () => {
        try {
            // API 호출
            const response = await axios.post(API_CREATE_WALLET, {});
            const { public_key, private_key } = response.data;

            // 키 암호화
            const encryptedPublicKey = CryptoJS.AES.encrypt(public_key, pin).toString();
            const encryptedPrivateKey = CryptoJS.AES.encrypt(private_key, pin).toString();

            // 지갑 JSON 파일 생성
            const blob = new Blob([JSON.stringify({ encryptedPublicKey, encryptedPrivateKey })], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wallet.json';
            a.click();
            URL.revokeObjectURL(url);

            navigate('/login');
        } catch (error) {
            console.error('Error creating wallet:', error);
        }
    };

    return (
        <div>
            <h1>Bit Pay</h1>
            <h3>Sign Up</h3>
            <div>
                <input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                />
                <button className="mainButton" onClick={handleCreateWallet}>Create Wallet</button>
            </div>
        </div>

    );
}

export default Signup;