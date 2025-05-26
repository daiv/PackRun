import React, { createContext } from 'react';

const ConnContext = createContext<boolean>(false);

export const connProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


  return (
    <ConnContext.Provider value={false}>
      {children}
    </ConnContext.Provider>
  );
} 