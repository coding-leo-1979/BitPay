import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

import logoutLogo from '../assets/logout.png';
import copyLogo from '../assets/copy.png';
const API_HOME = import.meta.env.VITE_API_URL + "/home";

function Home({ publicKey }) {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();
    const scrollPositionRef = useRef(0);
    const myWallet = localStorage.getItem('publicKey');

    const fetchWalletData = async () => {
        try {
            const response = await axios.post(API_HOME, { myAddress: myWallet });
            setBalance(response.data.balance);
            setTransactions(response.data.transactions);
        } catch (error) {
            console.error('Error fetching wallet data:', error);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, [publicKey]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPosition = window.scrollY;
            if (currentScrollPosition <= scrollPositionRef.current && currentScrollPosition !== 0) {
                fetchWalletData();
            }
            scrollPositionRef.current = currentScrollPosition;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('publicKey');
        localStorage.removeItem('privateKey');
        localStorage.removeItem('pin');
        navigate('/');
    };

    return (
        <div>
            <div className="myWalletDiv" style={{ display: 'flex', alignItems: 'center' }}>
                <p className="myWallet">{myWallet}</p>
                <img src={copyLogo} className="copyLogo" alt="Copy logo" onClick={() => {
                        navigator.clipboard.writeText(myWallet);
                    }}
                />
                <img src={logoutLogo} onClick={ handleLogout }  className="logoutLogo" alt="Logout logo" style={{ marginLeft: 'auto' }} />
            </div>

            <p className="txn_balance">
                {new Intl.NumberFormat().format(balance)} coins
            </p>


            <div>
                <button className="leftButton" onClick={() => navigate('/genQR')}>My QR</button>
                <button className="rightButton" onClick={() => navigate('/send')}>Send</button>
            </div>

            <ul>
                {Array.isArray(transactions) && transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                        <li key={index}>
                            <div className="txn_time">{new Date(tx.time*1000).toLocaleString()}</div>
                            <div className="txn_client">
                                {tx.sender === myWallet
                                    ? `${tx.recipient}`
                                    : tx.recipient === myWallet
                                    ? `${tx.sender}`
                                    : 'Error'}
                            </div>
                            <div
                                className="txn_amount"
                                style={{
                                    color:
                                        tx.sender === myWallet
                                            ? 'gray'
                                            : tx.recipient === myWallet
                                            ? '#6666ff'
                                            : 'black',
                                }}
                            >
                                {tx.sender === myWallet
                                    ? `-${tx.amount.toLocaleString()}`
                                    : tx.recipient === myWallet
                                    ? `+${tx.amount.toLocaleString()}`
                                    : `${tx.amount.toLocaleString()}`}
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No transactions</p>
                )}
            </ul>


            <div>
                <button className="wholeButton" onClick={() => navigate('/wallet')}>More</button>
            </div>
        </div>
    );
}

export default Home;