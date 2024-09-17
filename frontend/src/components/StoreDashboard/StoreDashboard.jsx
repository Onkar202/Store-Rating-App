import React from "react";
// import { useState,useEffect } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StoreDashboard = () =>{
    const [averageRating, setAverageRating] = useState(null);
    const [ratingCount, setRatingCount] = useState(0);
    const [usersWhoRated, setUsersWhoRated] = useState([]);
    const [store, setStore] = useState(null); // To display the store details of the logged-in store owner
    const navigate = useNavigate();

  
    // Fetch dashboard data when the component mounts
    useEffect(() => {
      const fetchDashboardData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/"); // If no token, redirect to login page
          return;
        }
  
        try {
          const response = await fetch("http://localhost:5000/store/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const data = await response.json();
  
          if (response.ok) {
            setAverageRating(data.averageRating);
            setRatingCount(data.ratingCount);
            setUsersWhoRated(data.usersWhoRated);
            setStore(data.store); // Store details of the logged-in store owner
          } else {
            console.error(data.message);
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
  
      fetchDashboardData();
    }, [navigate]);
  
    // Handle Logout: clear token and navigate to login page
  
    return (
        <>
           <div className="dashboard">
          <h1>Store Owner Dashboard</h1>
  
          {/* Store Information */}
          {store && (
            <div className="store-info">
              <h2>Your Store: {store.name}</h2>
              <p>Email: {store.email}</p>
              <p>Address: {store.address}</p>
            </div>
          )}
  
          <div className="average-rating">
            <h2>Average Rating</h2>
            <p>{ratingCount > 0 ? `${averageRating} (${ratingCount} ratings)` : "No ratings yet"}</p>
          </div>
  
          <div className="user-ratings">
            <h2>Users Who Rated</h2>
            {usersWhoRated.length > 0 ? (
              <ul>
                {usersWhoRated.map((user) => (
                  <li key={user._id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users have rated your store yet.</p>
            )}
          </div>
        </div></>
    )
}
export default StoreDashboard;