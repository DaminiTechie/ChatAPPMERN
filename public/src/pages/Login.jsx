import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { email, password } = values;
    if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { email, password } = values;

      try {
        const { data } = await axios.post(loginRoute, {
          email,
          password,
        });

        if (data.status === false) {
          toast.error(data.message, toastOptions);
        } else {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user)); // Store user info
          navigate("/chat"); // Redirect to chat page
        }

      } catch (error) {
        toast.error("Login failed. Please try again.", toastOptions);
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account? <Link to="/">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(89.7deg, #000000 -10.7%, #355c7d 88.8%);

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    color: white;
    margin-bottom: 1rem;

    img {
      height: 5rem;
    }

    h1 {
      font-weight: 700;
      font-size: 2rem;
    }
  }

  form {
    background: #1e1e1e;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 400px;
  }

  input {
    width: 90%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid blue;
    border-radius: 4px;
    font-size: 16px;
    background-color: #2c2c2c;
    color: #ffffff;
    margin-bottom: 20px;
  }

  button {
    width: 90%;
    padding: 0.75rem;
    background-color: blue;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0055ff;
    }
  }

  span {
    margin-top: 1rem;
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
