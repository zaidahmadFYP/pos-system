import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Adjust path as needed
import Login from './Components/Login/Login';
import PosCentral from './Components/PosCentral/PosCental';
import Dashboard from './Components/PosCentral/Dashboard/Dashboard';
import Menu from './Components/PosCentral/Menu/Menu';
import Orders from './Components/PosCentral/Orders/Orders';
import PosCentralPage from './Components/PosCentral/PosCentralPage/PosCentralPage';
import Inventory from './Components/PosCentral/Inventory/Inventory';
import ShowJournalPage from './Components/PosCentral/PosCentralPage/ShowJournalPage/ShowJournalPage'; 
import SuspendTransactionPage from './Components/PosCentral/PosCentralPage/SuspendTransactionPage/SuspendTransactionPage'; 
import RecallTransactionPage from './Components/PosCentral/PosCentralPage/RecallTransactionPage/RecallTransactionPage'; 
import Reports from './Components/PosCentral/Report/Report';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/loop/*" element={<PosCentral />}>
            <Route index element={<PosCentralPage />} />
            <Route path="poscentral" element={<PosCentralPage />} />
            <Route path="dashboard" element={<Dashboard />} />  
            <Route path="menu" element={<Menu />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="reports" element={<Reports />} />
            {/* Add routes for the new pages */}
            <Route path="show-journal" element={<ShowJournalPage />} />
            <Route path="suspend-transaction" element={<SuspendTransactionPage />} />
            <Route path="recall-transaction" element={<RecallTransactionPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;