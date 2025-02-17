import React, { createContext, useContext, useState } from 'react';
import {
  fetchAllAccommodations,
  addAccommodation as addAccommodationService,
  updateAccommodation as updateAccommodationService,
  deleteAccommodation as deleteAccommodationService,
  fetchAllClients,
  fetchAllReservations,
  addFilesToAccommodation,
  removeFileFromAccommodation
} from '../services/firestoreService';
import { uploadFile, deleteFile } from '../services/firebaseStorageService';
import { useAuth } from './AuthProvider';

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
  const { role, verifyAdmin } = useAuth();
  const isAdmin = role === 'admin';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeAdminAction = async (action, ...args) => {
    try {
      setLoading(true);
      await verifyAdmin();
      return await action(...args);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        loading,
        error,
        fetchAllAccommodations: () => executeAdminAction(fetchAllAccommodations),
        fetchAllClients: () => executeAdminAction(fetchAllClients),
        fetchAllReservations: () => executeAdminAction(fetchAllReservations),
        addAccommodation: async (data, folder, files) => {
          return executeAdminAction(async () => {
            const uploadedFiles = files && files.length ? await uploadFile(files, folder, verifyAdmin) : [];
            const accommodationData = { ...data, files: uploadedFiles || [] };
            const addedAccommodation = await addAccommodationService(accommodationData, verifyAdmin);
            if (uploadedFiles.length) {
              await addFilesToAccommodation(addedAccommodation.id, uploadedFiles, verifyAdmin);
            }
            return addedAccommodation;
          });
        },
        updateAccommodation: async (id, data, folder, files) => {
          return executeAdminAction(async () => {
            const uploadedFiles = files && files.length ? await uploadFile(files, folder, verifyAdmin) : [];
            const updatedData = { ...data, files: uploadedFiles || [] };
            const updatedAccommodation = await updateAccommodationService(id, updatedData, verifyAdmin);
            if (uploadedFiles.length) {
              await addFilesToAccommodation(id, uploadedFiles, verifyAdmin);
            }
            return updatedAccommodation;
          });
        },
        deleteAccommodation: async (id, files) => {
          return executeAdminAction(async () => {
            if (files && files.length) {
              await Promise.all(files.map(file => deleteFile(file.path, verifyAdmin)));
            }
            return await deleteAccommodationService(id, verifyAdmin);
          });
        }
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

export default AdminContextProvider;
