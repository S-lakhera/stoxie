import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import Footer from './Footer'

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <DashboardNavbar />
      <div className="dashboard-content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
