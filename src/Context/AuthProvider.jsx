import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth();
  const db = getFirestore();
  const provider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'Usuarios', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setRole(userSnap.data().role);
          } else {
            await setDoc(userRef, {
              name: currentUser.displayName || 'Usuário',
              email: currentUser.email,
              role: 'client',
            });
            setRole('client');
          }
          setUser(currentUser);
        } catch (error) {
          console.error('Erro ao buscar role do usuário:', error);
          setRole('guest');
        }
      } else {
        setUser(null);
        setRole('guest');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const verifyUser = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado.');
    try {
      await currentUser.getIdToken(true);
    } catch (error) {
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    return currentUser;
  };

  const loginWithEmailPassword = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw new Error(
        error.code === 'auth/wrong-password'
          ? 'Senha incorreta. Tente novamente.'
          : error.code === 'auth/user-not-found'
          ? 'Nenhuma conta encontrada com este e-mail.'
          : error.code === 'auth/too-many-requests'
          ? 'Muitas tentativas falhas. Aguarde antes de tentar novamente.'
          : 'Erro ao autenticar. Verifique sua conexão.'
      );
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      throw new Error('Erro ao autenticar com Google.');
    }
  };

  const loginWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      throw new Error('Erro ao autenticar com Facebook.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole('guest');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const verifyAdmin = async () => {
    if (role !== 'admin') {
      throw new Error('Acesso negado: Apenas administradores podem executar esta ação.');
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        loginWithEmailPassword,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        verifyUser,
        verifyAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
