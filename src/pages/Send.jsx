import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import QRLogo from '../assets/qr.png';
import QrScanner from "qr-scanner";

const API_SEND = import.meta.env.VITE_API_URL + "/send";

const Send = () => {
  const [sendAddress, setSendAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const videoRef = useRef(null);  // qr-scanner에서 사용할 videoRef
  const navigate = useNavigate();

  const myWallet = localStorage.getItem("publicKey");
  const privateKey = localStorage.getItem("privateKey");

  const formatNumber = (value) => {
    const formattedValue = value.replace(/[^\d]/g, '');
    if (formattedValue === '') return '';
    return Number(formattedValue).toLocaleString();
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const handleSend = async () => {
    if (!sendAddress || !amount) {
      alert("모든 값을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(API_SEND, {
        sendAddress,
        myAddress: myWallet,
        privateKey,
        amount: Number(amount),
      });

      alert("송금 완료");
      navigate('/home');
    } catch (error) {
      console.error("송금 오류:", error);
      alert("송금 실패");
    }
  };

  const handleScan = (result) => {
    if (result) {
      setSendAddress(result.data);
      setScanCompleted(true);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isScanning && videoRef.current) {
      const qrScanner = new QrScanner(videoRef.current, handleScan, {
        preferredCamera: "environment",  // 후면 카메라 사용
        highlightScanRegion: true,       // 스캔 영역 강조
        maxScansPerSecond: 10,           // 초당 10회 스캔
      });
      qrScanner.start();

      return () => qrScanner.destroy();
    }
  }, [isScanning]);

  const handleCloseScanner = () => {
    setIsScanning(false);
  };

  return (
    <div>
      <h1>Bit Pay</h1>
      <h3>Send Coins</h3>
      <img
        src={QRLogo}
        alt="QR Icon"
        style={{ width: "40px", height: "40px", cursor: "pointer" }}
        onClick={() => setIsScanning(true)}
      />
      <div>
        <input
          type="tel"
          value={sendAddress}
          onChange={(e) => setSendAddress(e.target.value)}
          placeholder="Wallet Address"
          inputMode="numeric"
        />
      </div>

      {isScanning && !scanCompleted && (
        <div style={{ marginTop: "10px" }}>
          <video ref={videoRef} style={{ width: "100%", height: "300px", objectFit: "cover" }} autoPlay playsInline />
        </div>
      )}

      {isScanning && (
        <button onClick={handleCloseScanner} style={{ marginTop: "10px" }}>
          닫기
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="tel"
          value={formatNumber(amount)}
          onChange={handleChange}
          placeholder="Coins"
          inputMode="numeric"
        />
      </div>

      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Send;