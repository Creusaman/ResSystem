import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { db } from '../Config/firebase';
import { collection, addDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';

const storage = getStorage();
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
const maxFileSize = 10 * 1024 * 1024; // 10MB

export const uploadFile = async (file, folder, verifyAdmin, onProgress) => {
  try {
    await verifyAdmin();
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não permitido: ${file.type}`);
    }
    if (file.size > maxFileSize) {
      throw new Error(`Arquivo muito grande: ${file.name}`);
    }
    
    const timestamp = new Date().getTime();
    const fileRef = ref(storage, `${folder}/${timestamp}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          }
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(fileRef);
          const fileData = { name: file.name, url, path: fileRef.fullPath };
          await saveFileMetadataToFirestore(folder, fileData);
          resolve(fileData);
        }
      );
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    throw error;
  }
};

export const saveFileMetadataToFirestore = async (folder, fileData) => {
  try {
    await addDoc(collection(db, folder), fileData);
  } catch (error) {
    console.error('Erro ao salvar metadados do arquivo no Firestore:', error);
    throw error;
  }
};

export const deleteFile = async (filePath, verifyAdmin) => {
  try {
    await verifyAdmin();
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    await deleteFileMetadataFromFirestore(filePath);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    throw error;
  }
};

export const deleteFileMetadataFromFirestore = async (filePath) => {
  try {
    const q = query(collection(db, 'arquivos'), where('path', '==', filePath));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.warn('Nenhum metadado encontrado para o arquivo:', filePath);
      return;
    }
    querySnapshot.forEach(async (docSnap) => {
      await deleteDoc(doc(db, 'arquivos', docSnap.id));
    });
  } catch (error) {
    console.error('Erro ao deletar metadados do Firestore:', error);
    throw error;
  }
};