import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Products from "./components/Products";
import Sells from "./components/Sells";
import Account from "./components/Account";
import InventoryReport from './components/InventoryReport';
import SalesReport from './components/SalesReports';
import Home from './components/Home';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="sells" element={<Sells />} />{" "}
          {/* Add the SellsPage route */}
          <Route path="inventory-report" element={<InventoryReport />} />{" "}
          <Route path="sales-report" element={<SalesReport />} />{" "}
          {/* Add the ReportsPage route */}
          <Route path="account" element={<Account />} />{" "}
          {/* Add the AccountPage route */}
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
