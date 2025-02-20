import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  orderBy,
  where,
  startAfter,
} from 'firebase/firestore';
import { db } from '../Config/firebase';


/**
 * 🔹 Funções para gerenciamento de acomodações
 */ 
export const fetchAllAccommodations = async () => {
  const querySnapshot = await getDocs(collection(db, 'Acomodacoes'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addAccommodation = async (data, verifyAdmin) => {
  await verifyAdmin();
  const docRef = await addDoc(collection(db, 'Acomodacoes'), data);
  return { id: docRef.id, ...data }; // Garantir retorno do ID
};

export const updateAccommodation = async (id, data, verifyAdmin) => {
  await verifyAdmin();
  const docRef = doc(db, 'Acomodacoes', id);
  await updateDoc(docRef, data);
  return { id, ...data };
};

export const deleteAccommodation = async (id, verifyAdmin) => {
  await verifyAdmin();
  const docRef = doc(db, 'Acomodacoes', id);
  await deleteDoc(docRef);
  return id;
};

/**
 * 🔹 Função para associar arquivos ao Firestore junto com a acomodação
 */
export const addFilesToAccommodation = async (accommodationId, files, verifyAdmin) => {
  await verifyAdmin();
  const docRef = doc(db, 'Acomodacoes', accommodationId);
  await updateDoc(docRef, { files });
};

/**
 * 🔹 Função para remover um arquivo da acomodação no Firestore
 */
export const removeFileFromAccommodation = async (accommodationId, fileUrl, verifyAdmin) => {
  await verifyAdmin();
  const docRef = doc(db, 'Acomodacoes', accommodationId);
  const accommodationSnap = await getDoc(docRef);
  if (!accommodationSnap.exists()) throw new Error('Acomodação não encontrada.');
  
  const accommodationData = accommodationSnap.data();
  const updatedFiles = accommodationData.files.filter(file => file.url !== fileUrl);
  await updateDoc(docRef, { files: updatedFiles });
};

/**
 * 🔹 Funções para gerenciamento de reservas
 */
export const addReservation = async (reservationData, verifyUser) => {
  const user = await verifyUser();
  const newReservationData = {
    ...reservationData,
    userId: user.uid,
    status: 'Pending',
    historicoAlteracoes: [],
    pagamento: {
      valorTotal: reservationData.pagamento?.valorTotal || 0,
      valorPago: reservationData.pagamento?.valorPago || 0,
      valorPendente: reservationData.pagamento?.valorPendente || 0,
      parcelas: reservationData.pagamento?.parcelas || 1,
      status: 'pendente',
      formaPagamento: reservationData.pagamento?.formaPagamento || 'desconhecido',
    },
  };
  const docRef = await addDoc(collection(db, 'Reservas'), newReservationData);
  return { id: docRef.id, ...newReservationData };
};

export const updateReservation = async (reservationId, updatedData, verifyOwnershipOrAdmin) => {
  const docRef = doc(db, 'Reservas', reservationId);
  await verifyOwnershipOrAdmin(docRef);
  await updateDoc(docRef, updatedData);
  return { id: reservationId, ...updatedData };
};

export const addPersonToReservation = async (reservationId, personData, verifyOwnershipOrAdmin) => {
  const docRef = doc(db, 'Reservas', reservationId);
  const reservationSnap = await getDoc(docRef);
  if (!reservationSnap.exists()) throw new Error('Reserva não encontrada.');
  
  const reservation = reservationSnap.data();
  reservation.itens.forEach((item) => {
    if (item.idAcomodacao === personData.idAcomodacao) {
      item.pessoasAdicionais = item.pessoasAdicionais || [];
      item.pessoasAdicionais.push(personData);
      item.precoFinal += personData.precoAdicional || 0;
    }
  });
  reservation.pagamento.valorTotal += personData.precoAdicional || 0;
  reservation.pagamento.valorPendente += personData.precoAdicional || 0;
  
  reservation.historicoAlteracoes.push({
    data: new Date().toISOString(),
    tipo: 'adicao_pessoa',
    descricao: `Pessoa adicionada à reserva: ${personData.nome}`,
    usuario: reservation.userId,
  });

  await verifyOwnershipOrAdmin(docRef);
  await updateDoc(docRef, reservation);
  return reservation;
};

export const fetchReservationsByUser = async (verifyUser) => {
  const user = await verifyUser();
  const q = query(collection(db, 'Reservas'), where('userId', '==', user.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const cancelReservation = async (reservationId, verifyOwnershipOrAdmin) => {
  return await updateReservation(reservationId, { status: 'Cancelled' }, verifyOwnershipOrAdmin);
};

/**
 * 🔹 Funções para gerenciamento de clientes
 */
export const fetchAllClients = async (verifyAdmin) => {
  await verifyAdmin();
  const querySnapshot = await getDocs(collection(db, 'Clientes'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
* 🔹 Funções para gerenciamento de reservas
*/
export const fetchUserReservations = async (userId, verifyOwnershipOrAdmin) => {
 await verifyOwnershipOrAdmin(userId);
 const q = query(collection(db, 'Reservas'), where('userId', '==', userId));
 const querySnapshot = await getDocs(q);
 return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchAllReservations = async (verifyAdmin) => {
 await verifyAdmin();
 const querySnapshot = await getDocs(collection(db, 'Reservas'));
 return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * 🔹 Funções para gerenciamento de regras de reserva
 */
export const fetchRulesForAccommodation = async (accommodationId) => {
  const q = query(collection(db, "Regras"), where("idAcomodacao", "==", accommodationId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addRuleToAccommodation = async (accommodationId, ruleData, verifyAdmin) => {
  await verifyAdmin();
  const newRule = { ...ruleData, idAcomodacao: accommodationId };
  const docRef = await addDoc(collection(db, 'Regras'), newRule);
  return { id: docRef.id, ...newRule };
};

export const updateRuleInAccommodation = async (ruleId, updatedData, verifyAdmin) => {
  await verifyAdmin();
  const docRef = doc(db, 'Regras', ruleId);
  await updateDoc(docRef, updatedData);
  return { id: ruleId, ...updatedData };
};

export const deleteRuleFromAccommodation = async (ruleId, verifyAdmin) => {
  await verifyAdmin();
  const docRef = doc(db, 'Regras', ruleId);
  await deleteDoc(docRef);
  return ruleId;
};

export const fetchUserPayments = async (userId) => {
  try {
    const q = query(collection(db, 'Pagamentos'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return [];
  }
};

export const validatePromoCode = async (promoCode) => {
  try {
    const promoRef = doc(db, "CodigosPromocionais", promoCode);
    const promoSnap = await getDoc(promoRef);
    
    if (promoSnap.exists() && promoSnap.data().valid) {
      return promoSnap.data().discount;
    }
    return 0;
  } catch (error) {
    console.error("Erro ao validar código promocional:", error);
    return 0;
  }
};

let cacheOccupancyData = null;
let cacheRevenueData = null;

export const fetchOccupancyData = async () => {
  if (cacheOccupancyData) return cacheOccupancyData;

  try {
    const snapshot = await getDocs(collection(db, "Ocupacao"));
    const labels = [];
    const data = [];

    snapshot.forEach(doc => {
      labels.push(doc.data().month);
      data.push(doc.data().occupancy);
    });

    cacheOccupancyData = {
      labels,
      datasets: [
        {
          label: "Taxa de Ocupação (%)",
          data,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };

    return cacheOccupancyData;
  } catch (error) {
    console.error("Erro ao buscar dados de ocupação:", error);
    return null;
  }
};

export const fetchRevenueData = async () => {
  if (cacheRevenueData) return cacheRevenueData;

  try {
    const snapshot = await getDocs(collection(db, "Faturamento"));
    const labels = [];
    const data = [];
    let total = 0;

    snapshot.forEach(doc => {
      labels.push(doc.data().month);
      data.push(doc.data().revenue);
      total += doc.data().revenue;
    });

    cacheRevenueData = {
      labels,
      total,
      datasets: [
        {
          label: "Faturamento (R$)",
          data,
          borderColor: "rgba(54, 162, 235, 1)",
          fill: false,
        },
      ],
    };

    return cacheRevenueData;
  } catch (error) {
    console.error("Erro ao buscar dados de faturamento:", error);
    return null;
  }
};


