import React from "react";
import StoreDashboard from "../../StoreDashboard/StoreDashboard";
import StoreChangePass from "../../StoreChangPass/StoreChangePass";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const StoreOwner = () => {
    
    const [active, setActive] = useState("home");
    const navigate = useNavigate();

    // Handle Change Password (redirect to change password page)
  

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch("http://localhost:5000/storeowner/logout", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            console.error("Failed to logout");
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }
      };
    
  
    return (
      <>
        <div className="navbar">
          <div className="nav-logo" onClick={()=>{
            setActive("home")
          }}>
            <p>Store Rating App</p>
          </div>
          <div className="links">
            <div className="change-pass-btn">
              <button onClick={()=>{
                setActive("changePass")
              }}>Change Password</button>
            </div>
  
            <div className="logout-btn">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
  
        {/* Dashboard Content */}
     
        {active === "home" && <StoreDashboard />}
        {active === "changePass" && <StoreChangePass />}

      </>
    );
  };
  
  export default StoreOwner;
  