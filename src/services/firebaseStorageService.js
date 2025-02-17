import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { db } from '../Config/firebase';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';

const storage = getStorage();
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
const maxFileSize = 10 * 1024 * 1024; // 10MB

/**
 * Uploads files to Firebase Storage with validation and progress tracking.
 * @param {File} file - The file to upload.
 * @param {string} folder - The folder to upload files to.
 * @param {Function} verifyAdmin - Function to verify user authentication.
 * @param {Function} onProgress - Callback function to report upload progress.
 * @returns {Promise<Object>} - A promise resolving with the uploaded file metadata.
 */
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

/**
 * Saves file metadata to Firestore.
 * @param {string} folder - The folder where the file is stored.
 * @param {Object} fileData - The file metadata to save.
 * @returns {Promise<void>}
 */
export const saveFileMetadataToFirestore = async (folder, fileData) => {
  try {
    await addDoc(collection(db, folder), fileData);
  } catch (error) {
    console.error('Erro ao salvar metadados do arquivo no Firestore:', error);
    throw error;
  }
};

/**
 * Deletes a file from Firebase Storage and Firestore.
 * @param {string} filePath - The path of the file to delete.
 * @param {Function} verifyAdmin - Function to verify admin permissions.
 * @returns {Promise<void>}
 */
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

/**
 * Deletes file metadata from Firestore.
 * @param {string} filePath - The path of the file to delete in Firestore.
 * @returns {Promise<void>}
 */
export const deleteFileMetadataFromFirestore = async (filePath) => {
  try {
    const querySnapshot = await listAll(ref(storage, filePath));
    for (const item of querySnapshot.items) {
      const docRef = doc(db, filePath, item.name);
      await deleteDoc(docRef);
    }
  } catch (error) {
    console.error('Erro ao deletar metadados do Firestore:', error);
    throw error;
  }
};
