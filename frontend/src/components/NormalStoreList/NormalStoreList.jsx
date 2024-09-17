import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NormalStore.css';

const NormalStoreList = () => {
  const [allStore, setAllStore] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const [sortOrder, setSortOrder] = useState({ field: '', direction: 'asc' }); // Add sort order state

  // Function to fetch stores and user ratings from the API
  const fetchStoresAndRatings = async () => {
    try {
      const response = await fetch("http://localhost:5000/stores"); // Fetch all stores
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const storeData = await response.json();
      setAllStore(storeData); // Update store data
      console.log(storeData[0].storeId)
      const userRatingsResponse = await fetch("http://localhost:5000/user-ratings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!userRatingsResponse.ok) {
        throw new Error("Error fetching user ratings");
      }
      const ratingsData = await userRatingsResponse.json();
      console.log(ratingsData)
      // Transform data into a dictionary for quick lookup
      const userRatingsDict = ratingsData.reduce((acc, { storeId, userRating }) => {
        acc[storeId] = userRating;
        return acc;
      }, {});
      setUserRatings(userRatingsDict); // Update user ratings data
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Error fetching data');
    }
  };

  // Fetch stores and user ratings when the component mounts
  useEffect(() => {
    fetchStoresAndRatings();
  }, []);

  // Function to handle rating submission
  const handleRatingSubmit = async (storeId, rating) => {
    if (rating < 1 || rating > 5) {
      alert('Please provide a rating between 1 and 5.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Submit user rating for the store
      await axios.post(`http://localhost:5000/stores/${storeId}/rating`, {
        rating
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      // After submission, fetch updated stores and user ratings
      await fetchStoresAndRatings();

      alert("Rating submitted successfully!");

    } catch (error) {
      console.error("Error submitting rating:", error);
      alert('Error submitting rating. Please try again.');
    }
  };

  // Function to sort stores by the given field and direction
  const sortStores = (field) => {
    const direction = sortOrder.field === field && sortOrder.direction === 'asc' ? 'desc' : 'asc';
    setSortOrder({ field, direction });

    const sortedStores = [...allStore].sort((a, b) => {
      const fieldA = a[field].toLowerCase();
      const fieldB = b[field].toLowerCase();

      if (fieldA < fieldB) return direction === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return direction === 'asc' ? 1 : -1;
      return 0;
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
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        placeholder="Filter by name, email, or address"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-input"
        id="btn"
      />

      {/* Add sorting buttons */}
      <div className="sorting-buttons">
        <button onClick={() => sortStores('name')}>
          Sort by Name {sortOrder.field === 'name' ? (sortOrder.direction === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => sortStores('email')}>
          Sort by Email {sortOrder.field === 'email' ? (sortOrder.direction === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>

      <table>
        <thead>
          <tr className="store-header">
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Add Your Rating</th>
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
                <td>{store.rating ? store.rating.toFixed(1) : "No rating"}</td>
                <td>
                  {userRatings[store._id] ? (
                    userRatings[store._id]
                  ) : (
                    "You haven't rated this store"
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Rate (1-5)"
                    id={`rating-${store._id}`}
                    className='rate'
                  />
                  <button
                    onClick={() => {
                      const rating = Number(document.getElementById(`rating-${store._id}`).value);
                      handleRatingSubmit(store._id, rating);
                    }}
                  >
                    Update/Submit Rating
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No stores available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NormalStoreList;
