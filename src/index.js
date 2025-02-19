import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import AuthProvider from './Context/AuthProvider';
import ClientContextProvider from './Context/ClientContextProvider';
import AdminContextProvider from './Context/AdminContextProvider';
import CartContextProvider from './Context/CartContextProvider';
import SharedContextProvider from './Context/SharedContextProvider';
import { RulesProvider } from './app/AdminDashboard/RulesManager/RulesContext'; // 🔹 Importação correta do RulesProvider
import { AccommodationProvider } from 'app/AdminDashboard/ManageAccommodations/AccommodationContext';
import { FileUploadProvider } from 'app/AdminDashboard/ManageAccommodations/FileUploadContext';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <SharedContextProvider>
        <CartContextProvider>
          <AdminContextProvider>
            <AccommodationProvider>
              <FileUploadProvider>
              <ClientContextProvider>
                <RulesProvider> {/* 🔹 Agora RulesContext está disponível globalmente */}
                  <App />
                </RulesProvider>
              </ClientContextProvider>
              </FileUploadProvider>
            </AccommodationProvider>
          </AdminContextProvider>
        </CartContextProvider>
      </SharedContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
