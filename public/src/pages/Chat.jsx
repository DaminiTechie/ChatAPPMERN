import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const storedUser = localStorage.getItem("chat-app-user");
    if (!storedUser) {
        navigate("/login");
    } else {
        const user = JSON.parse(storedUser);
        console.log("Retrieved user from localStorage:", user); // Add this log
        setCurrentUser(user);
    }
}, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);
  const fetchContacts = async () => {
    if (!currentUser) {
        console.error("Current user is not defined");
        return;
    }

    // Log the currentUser to verify it has an ID
    console.log("Current User in fetch:", currentUser);

    if (!currentUser.isAvatarImageSet) {
        navigate("/setAvatar");
        return;
    }

    if (!currentUser._id) {
        console.error("User ID is required but not found.");
        return;
    }

    try {
        console.log("Fetching contacts for user ID:", currentUser._id);
        const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data);
    } catch (error) {
        console.error("Error fetching contacts:", error.response?.data || error.message);
    }
};

  

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser= {currentUser} />
       
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    color: white;
    display: grid;
    grid-template-columns: 50% 40%;
    
    
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
