import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const GenQR = () => {
  const myAddress = localStorage.getItem("publicKey"); // 지갑 주소

  if (!myAddress) {
    return <p>지갑 주소가 없습니다. QR 코드를 생성할 수 없습니다.</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h3>My Wallet QR Code</h3>
      <QRCodeCanvas 
        value={myAddress} 
        size={256} // QR 코드 크기
        level={"H"} // 오류 복원 수준: L, M, Q, H
      />
    </div>
  );
};

export default GenQR;