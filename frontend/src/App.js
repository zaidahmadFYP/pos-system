// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import PosCentral from './Components/PosCentral/PosCental';
import Dashboard from './Components/PosCentral/Dashboard/Dashboard';
import Menu from './Components/PosCentral/Menu/Menu';
import Orders from './Components/PosCentral/Orders/Orders';
import PosCentralPage from './Components/PosCentral/PosCentralPage/PosCentralPage';
import Inventory from './Components/PosCentral/Inventory/Inventory';
// Import other components...


function App() {
  return (
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
          {/* Add other routes */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
