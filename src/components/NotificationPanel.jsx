import React, { useEffect, useState } from "react";
import { notificationService } from "../services/notificationService";
import "./NotificationPanel.css";

function NotificationPanel({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications(userId);
        setNotifications(data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    await notificationService.markAsRead(notificationId);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  return (
    <div className="notification-panel">
      <h2>Notificações</h2>
      {loading ? (
        <p>Carregando notificações...</p>
      ) : notifications.length > 0 ? (
        <ul>
          {notifications.map((noti) => (
            <li key={noti.id} className={`notification-item ${noti.read ? "read" : ""}`}>
              <p><strong>{noti.type.toUpperCase()}:</strong> {noti.message}</p>
              <p className="timestamp">{new Date(noti.timestamp.toDate()).toLocaleString()}</p>
              <button onClick={() => markAsRead(noti.id)}>Marcar como lida</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Sem novas notificações.</p>
      )}
    </div>
  );
}

export default NotificationPanel;
