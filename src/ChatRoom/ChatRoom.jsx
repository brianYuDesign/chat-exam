import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import moment from "moment";
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
    <div className="container clearfix">
      <div className="people-list" id="people-list">
        <ul className="list">
          {user?.chatList?.map((item, index) => (
            <>
              <Link
                className="clearfix"
                key={`c_${index}`}
                to={`/user/${user.name}/${item.id}`}
              >
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg"
                  alt="avatar"
                />
                <div className="about">
                  <div className="name">{item.id}</div>
                  <div className="status">
                    <i className="fa fa-circle online"></i> {item.lastMessage}
                  </div>
                </div>
              </Link>
            </>
          ))}
        </ul>
      </div>

      <div className="chat">
        <div className="chat-header clearfix">
          <img
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01_green.jpg"
            alt="avatar"
          />

          <div className="chat-about">
            <div className="chat-with">{chatId}</div>
          </div>
          <i className="fa fa-star"></i>
        </div>

        <div className="chat-history">
          <ul>
            {messages
              ?.sort(
                (a, b) =>
                  moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()
              )
              .map((message, i) => (
                <li
                  key={message.id}
                  className={`${message.userId === user.id ? "" : "clearfix"}`}
                >
                  <div
                    className={`message-data ${
                      message.userId === user.id ? "" : "align-right"
                    }`}
                  >
                    <span className="message-data-time">
                      {message.createdAt}
                    </span>
                    &nbsp; &nbsp;
                    <span className="message-data-name">{}</span>{" "}
                    <i className="fa fa-circle me"></i>
                  </div>
                  <div
                    className={`message  ${
                      message.userId === user.id
                        ? "my-message"
                        : "other-message float-right"
                    }`}
                  >
                    {message.content}
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="chat-message clearfix">
          <textarea
            value={newMessage}
            onChange={handleNewMessageChange}
            name="message-to-send"
            id="message-to-send"
            placeholder="Type your message"
            rows="3"
          ></textarea>
          <i className="fa fa-file-o"></i> &nbsp;&nbsp;&nbsp;
          <i className="fa fa-file-image-o"></i>
          <button onClick={handleSendMessage} className="send-message-button">
            Send
          </button>
        </div>
      </div>
    </div>

    // <div className="chat-room-container">
    //   {!user.id && <h1> user not found</h1>}
    //   <h1 className="room-name">User: {username}</h1>

    //   {user?.chatList?.map((item, index) => (
    //     <>
    //       <Link
    //         key={`c_${index}`}
    //         to={`/user/${user.name}/${item.id}`}
    //         className="button"
    //       >
    //         <p>{item.id}</p>
    //         <p>{item.lastMessage}</p>
    //         enter room
    //       </Link>
    //     </>
    //   ))}

    //   {chatId && (
    //     <>
    //       <h1 className="room-name">Room: {chatId}</h1>
    //       <div className="messages-container">
    //         <ol className="messages-list">
    //           {messages?.map((message, i) => (
    //             <li
    //               key={message.id}
    //               className={`message-item ${
    //                 message.userId === user.id
    //                   ? "my-message"
    //                   : "received-message"
    //               }`}
    //             >
    //               {message.content}
    //             </li>
    //           ))}
    //         </ol>
    //       </div>
    //       <textarea
    //         value={newMessage}
    //         onChange={handleNewMessageChange}
    //         placeholder="Write message..."
    //         className="new-message-input-field"
    //       />
    //       <button onClick={handleSendMessage} className="send-message-button">
    //         Send
    //       </button>
    //     </>
    //   )}
    // </div>
  );
};

export default ChatRoom;
