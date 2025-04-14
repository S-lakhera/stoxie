// HomeLayout.jsx
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import HomeNavbar from "./HomeNavbar";
import Footer from "./Footer";
import { AuthContext } from "../../context/AuthContext"; // adjust path if needed

const HomeLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <HomeNavbar />} {/* Show navbar only if user is logged in */}
      <Outlet />
      <Footer />
    </>
  );
};

export default HomeLayout;
