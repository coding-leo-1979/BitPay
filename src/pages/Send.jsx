import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import QRLogo from '../assets/qr.png';

const API_SEND = import.meta.env.VITE_API_URL + "/send";

const Send = () => {
  const [sendAddress, setSendAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false); // 스캔 완료 상태 추가

  const myWallet = localStorage.getItem("publicKey");
  const privateKey = localStorage.getItem("privateKey");

  // 숫자 포맷 함수 (세 자리마다 반점 추가)
  const formatNumber = (value) => {
    const formattedValue = value.replace(/[^\d]/g, ''); // 숫자 외의 문자는 제거
    if (formattedValue === '') return ''; // 비어 있으면 그냥 리턴
    return Number(formattedValue).toLocaleString(); // 반점 추가
  };

  // 입력값 변경 처리
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

  // QR 스캔 완료 후 상태 변경
  const handleScanResult = (result) => {
    if (result) {
      setSendAddress(result.text);
      setScanCompleted(true); // 스캔 완료 상태 설정
      setIsScanning(false); // 스캔 종료
    }
  };

  return (
    <div>
      <h1>Bit Pay</h1>
      <h3>Send Coins</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          value={sendAddress}
          onChange={(e) => setSendAddress(e.target.value)}
          placeholder="Wallet Address"
        />
        <img
          src={QRLogo}
          alt="QR Icon"
          style={{ width: "40px", height: "40px", cursor: "pointer" }}
          onClick={() => setIsScanning(true)}
        />
      </div>

      {/* QR 코드 스캔 화면 */}
      {isScanning && !scanCompleted && (
        <div style={{ marginBottom: "10px" }}>
          <QrReader
            onResult={(result, error) => {
              if (result) {
                handleScanResult(result); // 스캔 완료 후 처리
              }
              if (error) {
                console.error(error);
              }
            }}
            style={{ width: "100%" }}
          />
          <button onClick={() => setIsScanning(false)}>닫기</button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="tel" // 모바일에서 숫자 키보드만 뜨게 설정
          value={formatNumber(amount)}  // 포맷된 값 설정
          onChange={handleChange}  // 입력값 변경 처리
          placeholder="Coins"
          inputMode="numeric"  // 모바일에서 숫자만 입력되도록 설정
        />
        <div style={{ width: "40px", height: "40px", opacity: 0 }}></div>
      </div>

      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Send;