import React, { useState, useRef, useEffect } from 'react';
import { uploadUserFacePhoto } from '../../services/firebaseStorageService';
import { FaceTerminalSyncService } from '../../services/FaceTerminalSyncService';
import './CheckIn.css';

function CheckIn({ reservationId }) {
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setMessage('Erro ao acessar a câmera.');
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 300, 300);
    canvasRef.current.toBlob((blob) => {
      setPhoto(blob);
    }, 'image/jpeg');
  };

  const handleUpload = async () => {
    if (!photo) {
      setMessage('Nenhuma foto capturada.');
      return;
    }

    try {
      const photoUrl = await uploadUserFacePhoto(photo, reservationId);
      await FaceTerminalSyncService.syncHotesToTerminal();
      setMessage('Check-in concluído com sucesso!');
    } catch (error) {
      setMessage('Erro ao realizar check-in.');
    }
  };

  return (
    <div className="check-in">
      <h2>Check-In Digital</h2>
      <video ref={videoRef} autoPlay playsInline width="300" height="300"></video>
      <canvas ref={canvasRef} width="300" height="300" style={{ display: 'none' }}></canvas>
      <button onClick={capturePhoto}>Capturar Foto</button>
      <button onClick={handleUpload}>Confirmar Check-In</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CheckIn;
