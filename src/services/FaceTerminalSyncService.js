import { onSnapshot, collection, doc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../Config/firebase";

const websocket = new WebSocket("ws://152.244.203.193:7792");
const authToken = "MEU_TOKEN_SEGURO";

websocket.onopen = () => {
  websocket.send(JSON.stringify({ cmd: "auth", token: authToken }));
  console.log("Autenticado no terminal facial.");
};

websocket.onerror = (error) => {
  console.error("Erro na conexão com o terminal:", error);
};

onSnapshot(collection(db, "Reservas"), async (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === "added" || change.type === "modified") {
      const reservation = change.doc.data();

      if (reservation.status === "Confirmed" && !reservation.syncedWithTerminal) {
        reservation.guests.forEach(guest => {
          const payload = {
            cmd: "setuserinfo",
            enrollid: guest.document,
            name: guest.name,
            backupnum: 0,
            admin: 0,
            record: [{ starttime: reservation.checkIn, endtime: reservation.checkOut }],
            token: authToken
          };

          websocket.send(JSON.stringify(payload));
          console.log(`Sincronizando hóspede ${guest.name} automaticamente.`);
        });

        await updateDoc(doc(db, "Reservas", change.doc.id), { syncedWithTerminal: true });
      }
    }
  });
});

export const manualSync = async () => {
  try {
    const snapshot = await getDocs(collection(db, "Reservas"));
    snapshot.docs.forEach(async (docSnap) => {
      const reservation = docSnap.data();
      if (reservation.status === "Confirmed" && !reservation.syncedWithTerminal) {
        reservation.guests.forEach((guest) => {
          const payload = {
            cmd: "setuserinfo",
            enrollid: guest.document,
            name: guest.name,
            backupnum: 0,
            admin: 0,
            record: [{ starttime: reservation.checkIn, endtime: reservation.checkOut }],
            token: authToken,
          };

          websocket.send(JSON.stringify(payload));
          console.log(`Sincronizando hóspede ${guest.name} manualmente.`);
        });

        await updateDoc(doc(db, "Reservas", docSnap.id), { syncedWithTerminal: true });
      }
    });
  } catch (error) {
    console.error("Erro ao sincronizar manualmente:", error);
  }
};
