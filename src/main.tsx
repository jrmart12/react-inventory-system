import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import PrivateRoutes from "./components/PrivateRoutes";
import Products from "./components/Products";
import Sells from "./components/Sells";
import Account from "./components/Account";
import InventoryReport from "./components/InventoryReport";
import SalesReport from "./components/SalesReports";
import Home from "./components/Home";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<App />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Private Routes */}
        <Route path="/*" element={<PrivateRoutes />}>
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="home" element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="sells" element={<Sells />} />
            <Route path="inventory-report" element={<InventoryReport />} />
            <Route path="sales-report" element={<SalesReport />} />
            <Route path="account" element={<Account />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);