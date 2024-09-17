// src/RegisterPage.js
import React from "react";
import axios from "axios";
import "./RegisterPage.css"; // Optional: for styling
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Define the validation schema using yup
const schema = yup.object().shape({
  name: yup.string()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .required('Name is required'),
  address: yup.string()
    .max(400, 'Address cannot exceed 400 characters')
    .required('Address is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password cannot exceed 16 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[\W_]/, 'Password must contain at least one special character')
    .required('Password is required'),
  email: yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const AddUser = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [message, setMessage] = React.useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/register", {
        role: "Normal-User",
        ...data,
      });
      if (response) {
        setMessage("User added successfully!");
        console.log("User Added Successfully");
      } else {
        setMessage("Error Registering User use Another Email");
      }
    } catch (error) {
      console.error("Error registering User:", error);
      setMessage("Error Registering User");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
       
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            {...register('name')}
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register('email')}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            {...register('address')}
          />
          {errors.address && <p className="error-message">{errors.address.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            {...register('password')}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <button className="register-btn" type="submit">
            Register
          </button>
        </div>
      </form>

      <div className="register-link">
        <p>
          Have an account? <Link to="/">Login here</Link>
        </p>
      </div>

      {message && <p className="register-link">{message}</p>}
    </div>
  );
};

export default AddUser;
