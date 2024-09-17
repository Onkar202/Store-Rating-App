import React, { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import AddStore from "../AddStore/AddStore";
import AddUser from "../AddUser/AddUser";
import ListStore from "../ListStore/ListStore";
import ListUser from "../ListUser/ListUser";
import AllInfo from "../AllInfo/AllInfo";

const Navbar = () => {
  const [activeComponent, setActiveComponent] = useState("home");
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include' // Ensure cookies (session) are sent with the request
      });

      if (response.ok) {
        // Handle successful logout
        console.log('Logout successful');
        // Optionally redirect to login page or clear authentication state
        navigate('/'); // Simple approach to reload the page
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <div className="navbar">
        <div onClick={() => setActiveComponent("home")} className="nav-logo">
          <p>Store Rating App</p>
        </div>
        <div className="links">
          <div className="add-store-btn">
            <button
              onClick={() => setActiveComponent("addStore")}
              style={{
                textDecoration:
                  activeComponent === "addStore" ? "overline" : "",
              }}
            >
              Add Store
            </button>
          </div>
          <div className="add-user-btn">
            <button
              onClick={() => setActiveComponent("addUser")}
              style={{
                textDecoration:
                  activeComponent === "addUser" ? "overline" : "",
              }}
            >
              Add User
            </button>
          </div>
          <div className="list-user">
            <button
              onClick={() => setActiveComponent("listUser")}
              style={{
                textDecoration:
                  activeComponent === "listUser" ? "overline" : "",
              }}
            >
              User List
            </button>
          </div>
          <div className="list-store">
            <button
              onClick={() => setActiveComponent("listStore")}
              style={{
                textDecoration:
                  activeComponent === "listStore" ? "overline" : "",
              }}
            >
              Store List
            </button>
          </div>
          <div className="logout-btn">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {/* Conditional Rendering */}
      {activeComponent === "home" && <AllInfo />}
      {activeComponent === "addStore" && <AddStore />}
      {activeComponent === "addUser" && <AddUser />}
      {activeComponent === "listStore" && <ListStore />}
      {activeComponent === "listUser" && <ListUser />}
      {/* More components can be rendered here based on state */}
    </>
  );
};

export default Navbar;
