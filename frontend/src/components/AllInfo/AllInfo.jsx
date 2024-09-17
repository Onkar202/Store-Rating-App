import React, { useEffect, useState } from "react";
import axios from "axios";
import './AllInfo.css'

const AllInfo = () => {
  const [summaryData, setSummaryData] = useState({
    totalUsers: 0,
    totalStores: 0,
    usersWhoRated: [],
  });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch summary data from the API
  const fetchSummaryData = async () => {
    try {
      const token = localStorage.getItem('token'); // Ensure the token is available
      const response = await axios.get('http://localhost:5000/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSummaryData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching summary data:", error);
      setError('Error fetching summary data');
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchSummaryData();
  }, []);

  // Filter users based on the filter input
  const filteredUsers = summaryData.usersWhoRated.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase()) ||
    user.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="all-info-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Summary Information</h2>
          <p>Total Users: {summaryData.totalUsers}</p>
          <p>Total Stores: {summaryData.totalStores}</p>

          <h3>Users Who Submitted Ratings</h3>
          <input
            type="text"
            placeholder="Filter by name or email"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
          <table>
            <thead>
              <tr className="heading">
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllInfo;
