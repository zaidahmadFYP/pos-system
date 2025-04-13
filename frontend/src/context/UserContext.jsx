// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Store complete user object instead of just the name
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  // For backward compatibility, initialize employeeName from localStorage if needed
  const [employeeName, setEmployeeNameState] = useState(() => {
    return localStorage.getItem('employeeName') || (currentUser ? (currentUser.displayName || currentUser.name) : null);
  });
  
  // Update the setter to maintain both states
  const setEmployeeName = (name) => {
    setEmployeeNameState(name);
    
    if (!name) {
      setCurrentUser(null);
      return;
    }
    
    // If we only have the name, try to fetch full user data
    if (!currentUser || (currentUser.displayName !== name && currentUser.name !== name)) {
      fetchUserByName(name);
    }
  };

  // Fetch user data by name
  const fetchUserByName = async (name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001'; // Use .env URL or fallback to local
      const response = await axios.get(`${apiUrl}/api/users`, {
        params: {
          $or: [
            { displayName: name },
            { name: name }
          ]
        }
      });
      
      if (response.data && response.data.length > 0) {
        setCurrentUser(response.data[0]);
      } else {
        // Fallback: create a minimal user object with just the name
        setCurrentUser({ displayName: name, name: name });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback if API fails
      setCurrentUser({ displayName: name, name: name });
    }
  };
  
  // Update user information
  const updateUserInfo = (userData) => {
    setCurrentUser(userData);
    if (userData) {
      setEmployeeNameState(userData.displayName || userData.name);
    } else {
      setEmployeeNameState(null);
    }
  };

  // Persist user data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('employeeName', currentUser.displayName || currentUser.name);
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('employeeName');
    }
  }, [currentUser]);

  // Also persist employeeName separately for backward compatibility
  useEffect(() => {
    if (employeeName) {
      localStorage.setItem('employeeName', employeeName);
    } else if (!currentUser) {
      localStorage.removeItem('employeeName');
    }
  }, [employeeName, currentUser]);

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser: updateUserInfo, 
      employeeName, 
      setEmployeeName 
    }}>
      {children}
    </UserContext.Provider>
  );
};
