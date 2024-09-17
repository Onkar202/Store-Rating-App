import React, { useState, useEffect } from "react";
import axios from "axios"; // Optional: use axios instead of fetch if preferred
import "./ListUser.css";

const ListUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState(''); // State to track the field to sort by
  const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order

  // Function to fetch Users from the API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage

      const response = await fetch("http://localhost:5000/users", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized (e.g., redirect to login)
          setError("Unauthorized. Please log in again.");
        } else if (response.status === 403) {
          // Handle forbidden (e.g., token expired)
          setError("Access forbidden. Invalid token.");
        } else {
          setError("Failed to fetch users.");
        }
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setAllUsers(data); // Update state with fetched user data
    } catch (error) {
      console.error("Error fetching Users:", error);
      setError("Error fetching users.");
    }
  };

  // Fetch Users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle sorting
  const handleSort = (field) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    setSortField(field);
    setSortOrder(newOrder);
    const sortedUsers = [...allUsers].sort((a, b) => {
      if (newOrder === 'asc') {
        return a[field].localeCompare(b[field]);
      } else {
        return b[field].localeCompare(a[field]);
      }
    });
    setAllUsers(sortedUsers);
  };

  // Filter Users based on the filter input
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase()) ||
    user.address.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="user-container">
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Filter by name, email, or address"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-input"
      />
      
      {/* Sorting buttons */}
      <div className="sorting-buttons">
        <button onClick={() => handleSort('name')}>
          Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
        <button onClick={() => handleSort('email')}>
          Sort by Email ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>

      <table>
        <thead>
          <tr className="user-header">
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id} className="user-item">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No Users available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListUser;
