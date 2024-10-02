import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com`;
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingSettingAvatar, setLoadingSettingAvatar] = useState(false);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkLocalStorage = () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user) {
        navigate("/login");
      } else {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
        console.log("Retrieved user from local storage:", parsedUser);
      }
    };
    checkLocalStorage();
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar.", toastOptions);
      return;
    }
    try {
      if (!currentUser) {
        console.error("Current user is not set.");
        return;
      }
      setLoadingSettingAvatar(true);
      const response = await axios.post(`http://localhost:5000/api/auth/setAvatar/${currentUser.id}`, {
        avatar: avatars[selectedAvatar],
      });
      
      // Update current user with new avatar and set isAvatarImageSet to true
      const updatedUser = { ...currentUser, avatar: avatars[selectedAvatar], isAvatarImageSet: true };
      localStorage.setItem("chat-app-user", JSON.stringify(updatedUser)); // Save updated user
  
      console.log('Avatar set successfully:', response.data);
      toast.success("Avatar set successfully!", toastOptions);
      navigate("/chat");
    } catch (error) {
      console.error('Error setting avatar:', error.response ? error.response.data : error.message);
      toast.error('Error setting avatar. Please try again.', toastOptions);
    } finally {
      setLoadingSettingAvatar(false);
    }
  };
    

  const fetchAvatars = async () => {
    try {
      const avatarPromises = Array.from({ length: 4 }, () => {
        const randomId = Math.round(Math.random() * 1000);
        return axios.get(`${api}/${randomId}`);
      });
      const responses = await Promise.all(avatarPromises);
      const data = responses.map((response) => Buffer.from(response.data).toString("base64"));
      setAvatars(data);
    } catch (error) {
      console.error("Error fetching avatars:", error);
      toast.error("Error fetching avatars. Please try again.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, [api]);

  return (
    <Container>
      {isLoading ? (
        <img src={loader} alt="loader" className="loader" />
      ) : (
        <>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                key={index}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn" disabled={loadingSettingAvatar}>
            {loadingSettingAvatar ? "Setting..." : "Set as Profile Picture"}
          </button>
          <ToastContainer />
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      cursor: pointer;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff;
    }

    &:disabled {
      background-color: #3a3e6e;
      cursor: not-allowed;
    }
  }
`;
