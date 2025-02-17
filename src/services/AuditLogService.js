import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../Config/firebase";

export const AuditLogService = {
  async logChange(userId, actionType, description) {
    try {
      await addDoc(collection(db, "AuditLogs"), {
        userId,
        actionType,
        description,
        timestamp: new Date(),
      });
      console.log(`[LOG] ${actionType}: ${description}`);
    } catch (error) {
      console.error("Erro ao registrar log:", error);
    }
  },

  async getLogs() {
    try {
      const snapshot = await getDocs(collection(db, "AuditLogs"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
      return [];
    }
  },
};
