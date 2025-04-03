// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [employeeName, setEmployeeName] = useState(() => {
    const storedName = localStorage.getItem('employeeName') || null;
    console.log('Initial employeeName from localStorage:', storedName);
    return storedName;
  });

  // Persist employeeName to localStorage whenever it changes
  useEffect(() => {
    console.log('employeeName updated in context:', employeeName);
    if (employeeName) {
      localStorage.setItem('employeeName', employeeName);
      console.log('Saved to localStorage:', employeeName);
    } else {
      localStorage.removeItem('employeeName');
      console.log('Removed employeeName from localStorage');
    }
  }, [employeeName]);

  return (
    <UserContext.Provider value={{ employeeName, setEmployeeName }}>
      {children}
    </UserContext.Provider>
  );
};