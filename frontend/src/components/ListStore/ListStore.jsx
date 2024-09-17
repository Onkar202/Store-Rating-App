import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ListStore.css";

const ListStore = () => {
  const [allStore, setAllStore] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [sortField, setSortField] = useState(''); // State to track the field to sort by
  const [sortOrder, setSortOrder] = useState('asc'); // State to track sorting order

  // Function to fetch stores from the API
  const fetchStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/stores"); // Make a GET request to /stores endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); // Parse the JSON data from the response
      setAllStore(data); // Update the state with the fetched store data
    } catch (error) {
      console.error("Error fetching stores:", error);
      setError('Error fetching stores'); // Set error message
    }
  };

  // Fetch stores when the component mounts
  useEffect(() => {
    fetchStores();
  }, []);

  // Handle removal of a store
  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Ensure you have the token
  
      await axios.delete(`http://localhost:5000/stores/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authorization
        },
      });
  
      // Update state after successful deletion
      setAllStore(allStore.filter((store) => store._id !== id));
    } catch (error) {
      console.error("Error removing store:", error);
      // Optionally set an error message
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    setSortField(field);
    setSortOrder(newOrder);

    const sortedStores = [...allStore].sort((a, b) => {
      if (field === 'rating') {
        const aRating = a.rating_count > 0 ? a.rating / a.rating_count : 0;
        const bRating = b.rating_count > 0 ? b.rating / b.rating_count : 0;
        return newOrder === 'asc' ? aRating - bRating : bRating - aRating;
      } else {
        return newOrder === 'asc'
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
    });

    setAllStore(sortedStores);
  };

  // Filter stores based on the filter input
  const filteredStores = allStore.filter(store =>
    store.name.toLowerCase().includes(filter.toLowerCase()) ||
    store.email.toLowerCase().includes(filter.toLowerCase()) ||
    store.address.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="store-container">
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
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
        <button onClick={() => handleSort('rating')}>
          Sort by Rating ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>

      <table>
        <thead>
          <tr className="store-header">
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <tr key={store._id} className="store-item">
                <td><img src={store.image} alt={store.name} /></td>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.rating_count > 0 ? (store.rating / store.rating_count).toFixed(1) : "No rating"}</td>
                <td><button onClick={() => handleRemove(store._id)}>Remove</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No stores available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListStore;
