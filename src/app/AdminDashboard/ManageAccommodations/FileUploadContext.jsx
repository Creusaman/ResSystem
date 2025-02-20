import React, { createContext, useContext, useState } from "react";
import { uploadFiles, deleteFiles } from "services/firebaseStorageService";
import { useAuth } from "Context/AuthProvider";

const FileUploadContext = createContext();

export const FileUploadProvider = ({ children }) => {
  const { verifyAdmin } = useAuth(); // ✅ Obtém a função de verificação de admin
  const [files, setFiles] = useState([]);

  const handleUpload = async (file, accommodationName, accommodationId) => {
    try {
      if (!verifyAdmin) throw new Error("Erro: Permissões não verificadas");
      
      const uploadedFile = await uploadFiles(file, accommodationName, accommodationId, verifyAdmin);
      setFiles((prev) => [...prev, uploadedFile]);
      return uploadedFile;
    } catch (error) {
      console.error("Erro no upload:", error);
      throw error; // Propagação correta do erro
    }
  };

  const handleDelete = async (filePath) => {
    try {
      if (!verifyAdmin) throw new Error("Erro: verifyAdmin não está definido.");
      
      await deleteFiles(filePath, verifyAdmin);
      setFiles((prev) => prev.filter((file) => file.path !== filePath));
    } catch (error) {
      console.error("Erro ao excluir arquivo:", error);
    }
  };

  return (
    <FileUploadContext.Provider value={{ files, handleUpload, handleDelete }}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUpload = () => useContext(FileUploadContext);