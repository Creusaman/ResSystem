import { addDoc, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../Config/firebase";

export const notificationService = {
  async sendNotification(userId, message, type = "info") {
    try {
      await addDoc(collection(db, "Notificacoes"), {
        userId,
        message,
        type, // Ex: "reserva", "pagamento", "aviso"
        read: false,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }
  },

  async getNotifications(userId) {
    try {
      const snapshot = await getDocs(collection(db, "Notificacoes"));
      return snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((noti) => noti.userId === userId);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return [];
    }
  },

  async markAsRead(notificationId) {
    try {
      const notiRef = doc(db, "Notificacoes", notificationId);
      await updateDoc(notiRef, { read: true });
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  },
};
