import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import "./ChatRoom.css";
import useUser from "../useUser";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { backendUrl } from "../utils";

const ChatRoom = (props) => {
  const { username, chatId } = props.match.params;
  const { user } = useUser(username);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(backendUrl, {
      query: { chatId },
    });

    socketRef.current.on("CREATE_MESSAGE", (newMessage) => {
      setMessages((messages) => [newMessage, ...messages]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId]);

  const sendMessage = (content) => {
    socketRef.current.emit("SEND_MESSAGE", {
      chatId: chatId,
      userId: user.id,
      content: content,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `${backendUrl}/chat/${chatId}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.log("error", error);
      }
    };

    if (chatId) {
      fetchData();
    }
  }, [chatId]);
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-room-container">
      {!user.id && <h1> user not found</h1>}

      {user?.chatList?.map((item, index) => (
        <>
          <Link
            key={`c_${index}`}
            to={`/user/${user.name}/${item.id}`}
            className="button"
          >
            <p>{item.id}</p>
            <p>{item.lastMessage}</p>
            enter room
          </Link>
        </>
      ))}

      {chatId && (
        <>
          <h1 className="room-name">Room: {chatId}</h1>
          <div className="messages-container">
            <ol className="messages-list">
              {messages?.map((message, i) => (
                <li
                  key={message.id}
                  className={`message-item ${
                    message.userId === user.id
                      ? "my-message"
                      : "received-message"
                  }`}
                >
                  {message.content}
                </li>
              ))}
            </ol>
          </div>
          <textarea
            value={newMessage}
            onChange={handleNewMessageChange}
            placeholder="Write message..."
            className="new-message-input-field"
          />
          <button onClick={handleSendMessage} className="send-message-button">
            Send
          </button>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
