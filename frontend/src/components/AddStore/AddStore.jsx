import React, { useState } from "react";
import "./AddStore.css";
import axios from "axios";

const AddStore = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);

  const setImgUrl = async (file) => {
    const formData = new FormData();
    formData.append('store', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success === 1) {
        return response.data.image_url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
      return null;
    }
  };

  const validateForm = () => {
    // Validate name length
    if (name.length < 20 || name.length > 60) {
      setMessage("Name must be between 20 and 60 characters.");
      return false;
    }

    // Validate address length
    if (address.length > 400) {
      setMessage("Address must be less than 400 characters.");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format.");
      return false;
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setMessage("Password must be between 8 and 16 characters, and include at least one uppercase letter and one special character.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let imageUrl = '';
    if (image) {
      imageUrl = await setImgUrl(image);
    }

    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    try {
      const response = await axios.post('http://localhost:5000/addstore', {
        name,
        email,
        address,
        password,
        image: imageUrl
      }, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the headers
        }
      });

      if (response.data.message === 'Store added successfully!') {
        setMessage("Store added successfully!");
      } else {
        setMessage("Error adding store");
      }
    } catch (error) {
      console.error("Error adding store:", error);
      setMessage("Error adding store");
    }
  };

  return (
    <div className="addstore">
      <form onSubmit={handleSubmit}>
        <div className="group">
          <label>Name:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            placeholder="Enter Name" 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <div className="group">
          <label>Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="Enter Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div className="group">
          <label>Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            placeholder="Enter Password" 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <div className="group">
          <label>Address:</label>
          <textarea 
            id="address" 
            name="address" 
            rows="4" 
            required 
            placeholder="Enter Address" 
            onChange={(e) => setAddress(e.target.value)} 
          ></textarea>
        </div>
        <div className="group">
          <label>Upload Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
          />
          <hr />
        </div>
        <div className="group">
          <button type="submit">Submit</button>
        </div>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
};

export default AddStore;
