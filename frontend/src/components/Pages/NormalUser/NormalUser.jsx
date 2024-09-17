import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NormalStoreList from "../../NormalStoreList/NormalStoreList";
import ChangePassword from "../../ChangePassword/ChangePassword";

const NormalUser = () =>{
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
          <div className="change-pass-btn">
            <button
              onClick={() => setActiveComponent("changepass")}
              style={{
                textDecoration:
                  activeComponent === "changepass" ? "overline" : "",
              }}
            >
              Change Password
            </button>
          </div>
        
      
          <div className="logout-btn">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {/* Conditional Rendering */}
      {/* {activeComponent === "addStore" && <AddStore />} */}
     
      {/* More components can be rendered here based on state */}
      {activeComponent === "home" && <NormalStoreList />}
      {activeComponent === "changepass" && <ChangePassword />}
    </>
  );
}
export default NormalUser