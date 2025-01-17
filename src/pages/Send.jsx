import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import QRLogo from '../assets/qr.png';
import { Html5QrcodeScanner } from "html5-qrcode";

const API_SEND = import.meta.env.VITE_API_URL + "/send";

const Send = () => {
  const [sendAddress, setSendAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [scanner, setScanner] = useState(null);
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

  const handleScanResult = (result) => {
    if (result) {
      const qrAddress = result.text;
      setSendAddress(qrAddress);
      setScanCompleted(true);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isScanning) {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);  // 모바일 여부 확인
      const cameraId = isMobile ? "environment" : "user";  // 모바일일 경우 후면 카메라, 아니면 웹캠

      const newScanner = new Html5QrcodeScanner("qr-scanner", {
        fps: 10,
        qrbox: 250,
        facingMode: cameraId,  // 카메라 선택 모드 설정
      });

      newScanner.render(handleScanResult);
      setScanner(newScanner);  // scanner 객체 상태에 저장
    }

    return () => {
      if (scanner) {
        scanner.clear();  // 컴포넌트가 언마운트되거나 스캔을 종료할 때 기존 스캐너 종료
      }
    };
  }, [isScanning]);

  const handleCloseScanner = () => {
    if (scanner) {
      scanner.clear();  // 카메라 종료 및 스캔 중지
    }
    setIsScanning(false);  // 스캐너 상태 종료
    setScanCompleted(false);  // 스캔 완료 상태 초기화
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
        <div id="qr-scanner" style={{ marginTop: "10px", width: "100%" }}></div>
      )}

      {isScanning && (
        <button onClick={handleCloseScanner} style={{ marginTop: "10px" }}>
          Close
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