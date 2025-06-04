import React, { createContext, useContext, useState } from 'react';

interface MaterialRequest {
  material: string;
  quantity: string;
  unit: string;
  preferredOption: string;
  comments: string;
  deliveryDate: string;
  status: string;
}

interface MaterialRequestsContextProps {
  requests: MaterialRequest[];
  addRequest: (request: MaterialRequest) => void;
  updateRequest: (index: number, updatedRequest: MaterialRequest) => void;
  deleteRequest: (index: number) => void; // Nueva función
}

const MaterialRequestsContext = createContext<MaterialRequestsContextProps | undefined>(undefined);

export const MaterialRequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<MaterialRequest[]>([]);

  const addRequest = (request: MaterialRequest) => {
    setRequests((prev) => [...prev, request]);
  };

  const updateRequest = (index: number, updatedRequest: MaterialRequest) => {
    setRequests((prev) => {
      const newRequests = [...prev];
      newRequests[index] = updatedRequest;
      return newRequests;
    });
  };

  const deleteRequest = (index: number) => {
    setRequests((prev) => prev.filter((_, i) => i !== index)); // Eliminar la solicitud por índice
  };

  return (
    <MaterialRequestsContext.Provider value={{ requests, addRequest, updateRequest, deleteRequest }}>
      {children}
    </MaterialRequestsContext.Provider>
  );
};

export const useMaterialRequests = () => {
  const context = useContext(MaterialRequestsContext);
  if (!context) {
    throw new Error('useMaterialRequests debe usarse dentro de MaterialRequestsProvider');
  }
  return context;
};