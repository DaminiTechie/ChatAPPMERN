import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { registerRoute } from '../../utils/APIRoutes';
import axios from 'axios';

// Define FormContainer styled component
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1c1c1c, #3b6978);

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    color: white;
    margin-bottom: 2rem;

    img {
      height: 4rem;
    }

    h1 {
      font-weight: 700;
      font-size: 1.8rem;
    }
  }

  form {
    background: #252525;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 360px;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1.25rem;
    border: 1px solid blue;
    border-radius: 6px;
    font-size: 14px;
    background-color: #2c2c2c;
    color: #ffffff;
  }

  .password-container {
    position: relative;
    width: 100%;
  }

  .password-container input {
    width: 100%; 
    padding-right: 2.5rem;
  }

  .eye-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #bbbbbb;
  }

  .eye-icon:hover {
    color: #ffffff;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: blue;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: blue;
    }
  }

  span {
    margin-top: 1.25rem;
    font-size: 14px;
    color: #e0e0e0;
  }

  a {
    color: blue;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const LOCALHOST_KEY = import.meta.env.VITE_LOCALHOST_KEY;

    if (localStorage.getItem(LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = formData;
    const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", toastOptions);
      return false;
    }

    if (password.length < 8) {
      toast.error("Password should be at least 8 characters long.", toastOptions);
      return false;
    }

    if (!specialCharacterPattern.test(password)) {
      toast.error("Password should contain at least one special character.", toastOptions);
      return false;
    }

    if (username.length < 3) {
      toast.error("Username should be at least 3 characters long.", toastOptions);
      return false;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = formData;
      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        });
  
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        } else if (data.status === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user));
          navigate("/setAvatar");
        }
      } catch (error) {
        toast.error("Registration failed. Please try again.", toastOptions);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className='brand'>
            <img src={Logo} alt="logo" />
            <h1>TalkNest</h1>
          </div>
          <input
            type="text"
            placeholder='Username'
            name='username'
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder='Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Password'
              name='password'
              value={formData.password}
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="eye-icon"
            />
          </div>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder='Confirm Password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEyeSlash : faEye}
              onClick={toggleConfirmPasswordVisibility}
              className="eye-icon"
            />
          </div>
          <button type='submit'>Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

export default Register;
