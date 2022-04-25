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
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(async () => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
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
  background-color: #28c073;
  // background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR__mO27JnYo0G_3-TI16kvCQCNmynoeobbGQ&usqp=CAU");
  // background-size: cover;
  // background-repeat: no-repeat;
  @media screen and (max-width: 700px) {
   overflow:scroll
  }

  .container {
    height: 85vh;
    width: 85vw;
    // background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (max-width: 700px) {
      height: 85vh;
      width: 100vw;
      grid-template-columns: 100%;
      grid-template-rows: 20vh 80vh;

      height: 100vh;

      Contacts{
        // height: 50vh;
        overflow:scroll

      }

      // ChatContainer{
      //   height: 50vh;
      //   overflow:scroll


      // }



      // grid-template-columns: 100%;

    }

  
`;
