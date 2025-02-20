import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../Config/firebase';
import { collection, addDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage();
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
const maxFileSize = 10 * 1024 * 1024; // 10MB

export const uploadFiles = async (file, accommodationName, accommodationId, verifyAdmin) => {
  try {
    await verifyAdmin();

    // Validações do arquivo
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não permitido: ${file.type}`);
    }
    
    if (file.size > maxFileSize) {
      throw new Error(`Arquivo excede o limite de 10MB: ${file.name}`);
    }

    // Sanitização do nome da acomodação
    const sanitizedName = accommodationName.replace(/[^a-zA-Z0-9]/g, '_');
    const folderPath = `accommodations/${sanitizedName}_${accommodationId}`;
    
    // Geração de nome único para o arquivo
    const fileName = `${uuidv4()}_${file.name}`;
    const fileRef = ref(storage, `${folderPath}/${fileName}`);
    
    // Upload para o Storage
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error('Erro durante o upload:', error);
          reject(error);
        },
        async () => {
          try {
            // Obter URL e salvar metadados
            const url = await getDownloadURL(fileRef);
            const fileData = {
              id: uuidv4(),
              url,
              path: fileRef.fullPath,
              name: file.name,
              type: file.type,
              accommodationId,
              createdAt: new Date().toISOString()
            };
            
            await saveFileMetadataToFirestore('arquivos', fileData);
            resolve(fileData);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};

export const saveFileMetadataToFirestore = async (collectionName, fileData) => {
  try {
    await addDoc(collection(db, collectionName), fileData);
  } catch (error) {
    console.error('Erro ao salvar metadados:', error);
    throw error;
  }
};

export const deleteFiles = async (filePath, verifyAdmin) => {
  try {
    await verifyAdmin();
    const fileRef = ref(storage, filePath);
    
    // Deletar do Storage
    await deleteObject(fileRef);
    
    // Deletar metadados do Firestore
    await deleteFilesMetadataFromFirestore(filePath);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw error;
  }
};

export const deleteFilesMetadataFromFirestore = async (filePath) => {
  try {
    const q = query(collection(db, 'arquivos'), where('path', '==', filePath));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return;

    const deletePromises = querySnapshot.docs.map(docSnap => 
      deleteDoc(doc(db, 'arquivos', docSnap.id))
    );
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Erro ao deletar metadados:', error);
    throw error;
  }
};